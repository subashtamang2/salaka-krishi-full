import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { FAQ_CATEGORY } from "generated/prisma/enums";
import { UpdateFaqDto } from "./dto/update-faq.dto";

@Injectable()
export class FaqHelper {
    constructor(private readonly prisma: PrismaService) { }
    findBySlug(slug: string) {
        return this.prisma.fAQ.findUnique({
            where: { slug: slug },
        });
    }
    create(createFaqDto: CreateFaqDto, userId: string) {
        return this.prisma.fAQ.create({
            data: {
                ...createFaqDto,
                createdById: userId,
            },
        });
    }
    findAll(category: FAQ_CATEGORY, search?: string) {
        return this.prisma.fAQ.findMany({
            where: {
                category: category,
                OR: [
                    { question: { contains: search ?? "", mode: "insensitive" } },
                    { answer: { contains: search ?? "", mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        });
    }
    findOne(id: string) {
        return this.prisma.fAQ.findUnique({
            where: { id: id },
        });
    }
    update(id: string, updateFaqDto: UpdateFaqDto) {
        return this.prisma.fAQ.update({
            where: { id: id },
            data: {
                ...updateFaqDto,
            },
        });
    }
    delete(id: string) {
        return this.prisma.fAQ.delete({
            where: { id: id },
        });
    }
}
