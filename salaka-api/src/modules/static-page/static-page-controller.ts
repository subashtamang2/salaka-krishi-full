import {
    Controller,
    Get,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Req,
    NotFoundException,
    Put,
} from "@nestjs/common";
import { StaticPageService } from "./static-page.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtPayload } from "../auth/interface";
import { Serializer } from "../../interceptors/serializer.interceptor";
import { StaticPage } from "./entities/static-page.entity";
import { ROLE } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorators";
import { CreateStaticPageDto } from "./dto/create-static-page-dto";
@Controller("static-page")
@Serializer(StaticPage)
export class StaticPageController {
    constructor(private readonly staticPageService: StaticPageService) { }

    @Put("/terms-and-conditions")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createStaticPageDto: CreateStaticPageDto,
        @Req() { user }: { user: JwtPayload }
    ) {
        const result = await this.staticPageService.createTermsAndConditions(
            createStaticPageDto,
            user?.sub
        );
        if (!result) {
            throw new InternalServerErrorException("Creation failed");
        }
        return {
            message: "Static page created successfully",
            data: result,
        };
    }

    @Put("/privacy-policy")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    @HttpCode(HttpStatus.CREATED)
    async createPrivacyPolicy(
        @Body() createStaticPageDto: CreateStaticPageDto,
        @Req() { user }: { user: JwtPayload }
    ) {
        const result = await this.staticPageService.createPrivacyPolicy(
            createStaticPageDto,
            user?.sub
        );
        if (!result) {
            throw new InternalServerErrorException("Creation failed");
        }
        return {
            message: "Static page created successfully",
            data: result,
        };
    }

    @Get("/terms-and-conditions")
    @HttpCode(HttpStatus.OK)
    async findAll() {
        const result = await this.staticPageService.findTermsAndConditions();
        if (!result) {
            throw new NotFoundException("Terms and Conditions not found");
        }
        return {
            message: "Terms and Conditions retrieved successfully",
            data: result,
        };
    }

    @Get("/privacy-policy")
    @HttpCode(HttpStatus.OK)
    async find() {
        const result = await this.staticPageService.findPrivacyPolicy();
        if (!result) {
            throw new NotFoundException("Privacy Policy not found");
        }
        return {
            message: "Privacy Policy retrieved successfully",
            data: result,
        };
    }

}
