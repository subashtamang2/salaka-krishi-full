import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { ROLE } from "generated/prisma/enums";

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
      where: { email, isGoogleLogin: true, role: "User" },
    });
  }
  findFacebookLoginUser(email: string) {
    return this.prisma.user.findFirst({
      where: { email, isFacebookLogin: true, role: "User" },
    });
  }
  async registerUser({ password, ...rest }: CreateAuthDto) {
    return await this.prisma.user.create({
      data: {
        ...rest,
        password: password
          ? await bcrypt.hash(password, this.saltRounds)
          : undefined,
        role: ROLE.User,
        status: "Active" as any,
      } as any,
    });
  }
  findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        role: ROLE.User,
      },
    });
  }
  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}

