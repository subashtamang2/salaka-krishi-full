import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateNewsletterDto } from "./dto/create-newsletter.dto";

@Injectable()
export class NewsletterService {
    constructor(private readonly prisma: PrismaService) { }
    async create(createNewsletterDto: CreateNewsletterDto) {
        const existingEmail = await this.prisma.newsletter.findFirst({
            where: { email: createNewsletterDto.email },
        });

        if (existingEmail) {
            throw new ConflictException("This email is already subscribed");
        }

        const result = await this.prisma.newsletter.create({
            data: createNewsletterDto,
        });

        if (!result) {
            throw new InternalServerErrorException("Failed to create newsletter");
        }
        return {
            message: "Newsletter created successfully",
            data: result,
        };
    }
    async findAll() {
        const newslettersList = await this.prisma.newsletter.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            message: "Newsletters retrieved successfully",
            data: newslettersList,
        };
    }
    async findOne(id: string) {
        const result = await this.prisma.newsletter.findUnique({
            where: { id },
        });
        return {
            message: "Newsletter retrieved successfully",
            data: result,
        };
    }
    async update(id: string) {
        const existing = await this.prisma.newsletter.findUnique({ where: { id } });
        if (!existing) {
            throw new InternalServerErrorException("Newsletter not found");
        }

        const newStatus = existing.status === "Subscribed" ? "Unsubscribed" : "Subscribed";

        const result = await this.prisma.newsletter.update({
            where: { id },
            data: {
                status: newStatus,
                updatedAt: new Date(),
            },
        });
        return {
            message: "newsletter updated successfully",
            data: result,
        };
    }
    async remove(id: string) {
        const result = await this.prisma.newsletter.delete({
            where: { id },
        });
        return {
            message: "Newsletter deleted successfully",
            data: result,
        };
    }
}
