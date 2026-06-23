import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderService } from '../order/order.service';
import { UploadProofDto } from './dto/upload-proof.dto';

@Injectable()
export class PaymentProofService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly orderService: OrderService,
    ) { }

    /**
     * Upload / Submit payment proof screenshot
     */
    async uploadProof(dto: UploadProofDto) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.orderId);
        const order = await this.prisma.order.findFirst({
            where: isUuid ? { id: dto.orderId } : { orderNumber: dto.orderId },
            include: { payment: true },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.paymentProvider !== 'OnlinePayment') {
            throw new BadRequestException('This order does not support online payment proof upload');
        }

        if (order.payment?.status === 'Paid') {
            throw new BadRequestException('Payment for this order has already been verified');
        }

        return this.prisma.paymentProof.create({
            data: {
                orderId: order.id,
                paymentId: order.payment?.id || null,
                screenshotUrl: dto.screenshotUrl,
                screenshotName: dto.screenshotName || null,
                status: 'Pending',
            },
        });
    }

    /**
     * Approve payment proof
     */
    async approveProof(proofId: string, adminId: string, note?: string) {
        const proof = await this.prisma.paymentProof.findUnique({
            where: { id: proofId },
            include: { payment: true },
        });

        if (!proof) {
            throw new NotFoundException('Payment proof not found');
        }

        if (proof.status !== 'Pending') {
            throw new BadRequestException('Payment proof is already processed');
        }

        // 1. Update PaymentProof record
        const updatedProof = await this.prisma.paymentProof.update({
            where: { id: proofId },
            data: {
                status: 'Approved',
                verifiedById: adminId,
                verifiedAt: new Date(),
                adminNote: note,
            },
        });

        // 2. Finalize order (updates payment status to Paid, clears cart, coupon usage, etc.)
        await this.orderService.finalizeOrder(proof.orderId, {
            transactionId: proofId,
            rawResponse: { approvedBy: adminId, note },
        });

        // 3. Sync verified info on the Payment record
        if (proof.paymentId) {
            await this.prisma.payment.update({
                where: { id: proof.paymentId },
                data: {
                    verifiedById: adminId,
                    verifiedAt: new Date(),
                    adminNote: note,
                },
            });
        }

        return updatedProof;
    }

    /**
     * Reject payment proof
     */
    async rejectProof(proofId: string, adminId: string, note?: string) {
        const proof = await this.prisma.paymentProof.findUnique({
            where: { id: proofId },
        });

        if (!proof) {
            throw new NotFoundException('Payment proof not found');
        }

        if (proof.status !== 'Pending') {
            throw new BadRequestException('Payment proof is already processed');
        }

        // 1. Update PaymentProof record
        const updatedProof = await this.prisma.paymentProof.update({
            where: { id: proofId },
            data: {
                status: 'Rejected',
                verifiedById: adminId,
                verifiedAt: new Date(),
                adminNote: note,
            },
        });

        // 2. Mark order payment as failed (cancels order, restores stock)
        await this.orderService.markPaymentFailed(proof.orderId);

        // 3. Sync verified info on the Payment record
        if (proof.paymentId) {
            await this.prisma.payment.update({
                where: { id: proof.paymentId },
                data: {
                    status: 'Failed',
                    verifiedById: adminId,
                    verifiedAt: new Date(),
                    adminNote: note,
                },
            });
        }

        return updatedProof;
    }

    /**
     * Get all pending payment proofs (Admin)
     */
    async getPendingProofs() {
        return this.prisma.paymentProof.findMany({
            where: { status: 'Pending' },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                payment: {
                    include: {
                        verifiedBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Get all payment proofs
     */
    async getAllProofs() {
        return this.prisma.paymentProof.findMany({
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                payment: {
                    include: {
                        verifiedBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Retain legacy verifyProof for backward compatibility
     */
    async verifyProof(
        paymentId: string,
        adminId: string,
        approved: boolean,
        note?: string,
    ) {
        const proof = await this.prisma.paymentProof.findFirst({
            where: { paymentId },
            orderBy: { createdAt: 'desc' },
        });

        if (proof) {
            if (approved) {
                return this.approveProof(proof.id, adminId, note);
            } else {
                return this.rejectProof(proof.id, adminId, note);
            }
        }

        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        if (approved) {
            await this.orderService.finalizeOrder(payment.orderId, {
                transactionId: paymentId,
                rawResponse: { approvedBy: adminId, note },
            });
        } else {
            await this.orderService.markPaymentFailed(payment.orderId);
        }

        return this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: approved ? 'Paid' : 'Failed',
                verifiedById: adminId,
                verifiedAt: new Date(),
                adminNote: note,
            },
        });
    }
}
