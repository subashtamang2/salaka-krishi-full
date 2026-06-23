import { Module } from "@nestjs/common";
import { PaymentProofController } from "./payment-proof.controller";
import { PaymentProofService } from "./payment-proof.service";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderModule } from "../order/order.module";

@Module({
    imports:[OrderModule],
    controllers: [PaymentProofController],
    providers: [PaymentProofService, PrismaService],
})
export class PaymentProofModule { }
