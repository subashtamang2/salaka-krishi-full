import { Injectable } from "@nestjs/common";
import { ROLE, USER_STATUS } from "generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserStrategy {
    constructor(private readonly prisma: PrismaService) { }
    findMany() {
        return this.prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                role: ROLE.User,
            },
        });
    }
    findOne(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id: id,
                role: ROLE.User,
            },
            include: {
                Cart: true,
                Wishlists: true,
            },
        });
    }
    findCurrentUser(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id: id,
            },

            include: {
                Cart: {
                    include: { products: true },
                },
            },
        });
    }
    findByStatus(status: USER_STATUS) {
        return this.prisma.user.findMany({
            where: {
                status,
                role: ROLE.User,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    updateUserStatus(id: string, status: USER_STATUS) {
        return this.prisma.user.update({
            where: {
                id,
                role: ROLE.User,
            },
            data: {
                status,
            },
        });
    }
    remove(id: string) {
        return this.prisma.user.delete({
            where: {
                id,
                role: ROLE.User,
            },
        });
    }

    async findByQuery(where: any, skip: number, take: number, orderBy: any) {
        const count = await this.prisma.user.count({ where });
        const users = await this.prisma.user.findMany({
            where,
            skip,
            take,
            orderBy: Object.keys(orderBy).length > 0 ? orderBy : { createdAt: "desc" }
        });
        return { users, count };
    }
}
