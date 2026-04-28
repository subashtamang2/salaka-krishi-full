import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
    HttpCode,
    HttpStatus,
    Query,
} from "@nestjs/common";
import { FaqService } from "./faq.service";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ROLE } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorators";

@Controller("faq")
export class FaqController {
    constructor(private readonly faqService: FaqService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    async create(@Body() createFaqDto: CreateFaqDto, @Req() { user }) {
        const result = await this.faqService.create(createFaqDto, user);
        return {
            message: "FAQ created successfully",
            data: result,
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query("search") search?: string) {
        const result = await this.faqService.findAll(search);
        console.log(search);

        return {
            message: "FAQs retrieved successfully",
            data: result,
        };
    }

    @Get(":id")
    @Get()
    @HttpCode(HttpStatus.OK)
    async findOne(@Param("id") id: string) {
        const result = await this.faqService.findOne(id);
        return {
            message: "FAQ retrieved successfully",
            data: result,
        };
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    @HttpCode(HttpStatus.OK)
    async update(@Param("id") id: string, @Body() updateFaqDto: UpdateFaqDto) {
        const result = await this.faqService.update(id, updateFaqDto);
        return {
            message: "FAQ updated successfully",
            data: result,
        };
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    async remove(@Param("id") id: string) {
        const result = await this.faqService.remove(id);
        return {
            message: "FAQ removed successfully",
            data: result,
        };
    }
}
