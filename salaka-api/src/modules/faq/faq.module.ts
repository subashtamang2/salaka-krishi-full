import { Module } from "@nestjs/common";
import { FaqController } from "./faq.controller";
import { FaqService } from "./faq.service";
import { FaqHelper } from "./faq.helper";

@Module({
    controllers: [FaqController],
    providers: [FaqService, FaqHelper],
})
export class FaqModule { }
