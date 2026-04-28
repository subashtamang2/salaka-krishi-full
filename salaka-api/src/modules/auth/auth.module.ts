/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CustomJwtService } from "./CustomJwt.service";
import { AuthRepository } from "./auth.repository";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
@Module({
imports:[PrismaModule,ConfigModule],
controllers:[AuthController],
providers: [AuthService,CustomJwtService,AuthRepository],
})
export class AuthModule{
}
