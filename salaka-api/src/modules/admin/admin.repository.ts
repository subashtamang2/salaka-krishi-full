import { Injectable } from "@nestjs/common";
import { ROLE, USER_STATUS } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminRepository {
    constructor(private readonly prisma: PrismaService) { }
    findAdmin(id: string) {
        return this.prisma.user.findFirst({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                id: id,
                role: {
                    in: [ROLE.Admin, ROLE.SuperAdmin],
                },
            },
            include: {
                blogs: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },

                products: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
    }
    findAdminByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: {
                email: email,
                role: {
                    in: [ROLE.Admin, ROLE.SuperAdmin],
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    createAdmin(createAdminDto: CreateAdminDto) {
        return this.prisma.user.create({
            data: createAdminDto,
        });
    }

    findAllAdmins() {
        return this.prisma.user.findMany({
            where: {
                role: {
                    in: [ROLE.Admin, ROLE.SuperAdmin],
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                _count: {
                    select: {
                        blogs: true,
                        products: true,
                    },
                },
            },

        });
    }

    async findByQuery(where: any, skip: number | undefined, take: number | undefined, orderBy: any) {
        const count = await this.prisma.user.count({ where });
        const admins = await this.prisma.user.findMany({
            where,
            skip,
            take,
            orderBy: Object.keys(orderBy).length > 0 ? orderBy : { createdAt: "desc" },
            include: {
                _count: {
                    select: {
                        blogs: true,
                        products: true,
                    },
                },
            },
        });
        return { admins, count };
    }

    findAdminAndUpdate(id: string, UpdateAdminDto: any) {
        return this.prisma.user.update({
            where: { id: id },
            data: {
                ...UpdateAdminDto,
            },
        });
    }

    revokeAdmin(id: string) {
        return this.prisma.user.update({
            where: { id: id },
            data: {
                status: USER_STATUS.Revoke,
            },
        });
    }
    suspendedAdmin(id: string) {
        return this.prisma.user.update({
            where: { id: id },
            data: {
                status: USER_STATUS.Suspended,
            },
        });
    }

    deleteAdmin(id: string) {
        return this.prisma.user.delete({
            where: { id: id },
        });
    }


    // this si for admin password reset

    async createPasswordResetToken(userId: string) {
        return this.prisma.passwordResetToken.create({
            data: {
                token: randomUUID(),
                userId,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            },
        });
    }

    async findPasswordResetToken(token: string) {
        return this.prisma.passwordResetToken.findUnique({
            where: { token },
        });
    }

    async markPasswordResetTokenUsed(id: string) {
        return this.prisma.passwordResetToken.update({
            where: { id },
            data: { isUsed: true },
        });
    }


    async updateAdminPassword(userId: string, password: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                password: await bcrypt.hash(password, 10),
            },
        });
    }






}
