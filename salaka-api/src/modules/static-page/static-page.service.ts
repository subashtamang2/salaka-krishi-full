import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateStaticPageDto } from "./dto/create-static-page-dto";
import { STATIC_PAGE_KEY } from "@prisma/client";

@Injectable()
export class StaticPageService {
    constructor(private readonly prisma: PrismaService) { }

    createTermsAndConditions(
        createStaticpageDto: CreateStaticPageDto,
        userId: string
    ) {
        return this.prisma.staticPage.upsert({
            where: { key: STATIC_PAGE_KEY.TermsAndConditions },
            update: {
                content: createStaticpageDto.content,
                updatedById: userId,
            },
            create: {
                key: STATIC_PAGE_KEY.TermsAndConditions,
                content: createStaticpageDto.content,
                createdBy: userId,
            },
        });
    }
    createPrivacyPolicy(
        createStaticPageDto: CreateStaticPageDto,
        userId: string
    ) {
        return this.prisma.staticPage.upsert({
            where: { key: STATIC_PAGE_KEY.PrivacyPolicy },
            update: {
                content: createStaticPageDto.content,
                updatedById: userId,
            },
            create: {
                key: STATIC_PAGE_KEY.PrivacyPolicy,
                content: createStaticPageDto.content,
                createdBy: userId,
            },

        });
    }
    findPrivacyPolicy() {
        return this.prisma.staticPage.findUnique({
            where: { key: STATIC_PAGE_KEY.PrivacyPolicy },
        });
    }
    findTermsAndConditions() {
        return this.prisma.staticPage.findUnique({
            where: { key: STATIC_PAGE_KEY.TermsAndConditions },
        });
    }

}
