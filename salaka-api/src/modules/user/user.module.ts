import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserStrategy } from "./user.strategy";

@Module({
controllers: [UserController],
providers: [UserService, UserStrategy],
exports: [UserService],
})
export class UserModule {}
