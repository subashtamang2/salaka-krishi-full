import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { ROLE } from "@prisma/client";

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
}

