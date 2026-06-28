import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { AdminRepository } from "./admin.repository";
import { CustomJwtService } from "../auth/CustomJwt.service";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { MailModule } from "src/common/mail/mail.module";

@Module({
    imports: [
        PrismaModule,
        MailModule,
    ],
    controllers: [AdminController],
    providers: [
        AdminService,
        AdminRepository,
        CustomJwtService
    ],
})
export class AdminModule { }
