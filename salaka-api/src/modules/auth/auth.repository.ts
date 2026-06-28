import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { ROLE } from "@prisma/client";
import { randomUUID } from "crypto";

@Injectable()
export class AuthRepository {
    private saltRounds: number;
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService
    ) {
        this.saltRounds = this.config.get<number>("salt")!;
    }

    findGoogleLoginUser(email: string) {
        return this.prisma.user.findFirst({
            where: { email, isGoogleLogin: true },
        });
    }
    findFacebookLoginUser(email: string) {
        return this.prisma.user.findFirst({
            where: { email, isFacebookLogin: true },
        });
    }
    async registerUser({ password, ...rest }: CreateAuthDto) {
        return await this.prisma.user.create({
            data: {
                ...rest,
                password: password
                    ? await bcrypt.hash(password, this.saltRounds)
                    : undefined,
                role: rest.role || ROLE.User,
                status: "Active" as any,
            } as any,
        });
    }
    findUserByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: {
                email,
            },
        });
    }
    findUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }


    // // forget password
    // async createPasswordResetToken(userId: string) {
    //     return this.prisma.passwordResetToken.create({
    //         data: {
    //             token: randomUUID(),
    //             userId,
    //             expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
    //         },
    //     });
    // }
    // async findPasswordResetToken(token: string) {
    //     return this.prisma.passwordResetToken.findUnique({
    //         where: {
    //             token,
    //         },
    //     });
    // }
    // async markPasswordResetTokenUsed(id: string) {
    //     return this.prisma.passwordResetToken.update({
    //         where: {
    //             id,
    //         },
    //         data: {
    //             isUsed: true,
    //         },
    //     });
    // }

    // async updateUserPassword(userId: string, password: string) {
    //     return this.prisma.user.update({
    //         where: {
    //             id: userId,
    //         },
    //         data: {
    //             password: await bcrypt.hash(password, this.saltRounds),
    //         },
    //     });
    // }




}
