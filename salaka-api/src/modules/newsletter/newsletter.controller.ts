import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NewsletterService } from "./newsletter.service";
import { Serializer } from "../../interceptors/serializer.interceptor";
import { CreateNewsletterDto } from "./dto/create-newsletter.dto";
import { Newsletters } from "./entities/newsletter.entity";

@ApiTags("Newsletter")
@Controller("newsletter")
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) { }

    @Post()
    @Serializer(Newsletters)
    create(@Body() createNewsletterDto: CreateNewsletterDto) {
        return this.newsletterService.create(createNewsletterDto);
    }
    @Get()
    findAll() {
        return this.newsletterService.findAll();
    }
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.newsletterService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string) {
        return this.newsletterService.update(id);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.newsletterService.remove(id);
    }
}
