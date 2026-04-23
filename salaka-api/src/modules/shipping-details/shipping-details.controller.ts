import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    BadRequestException,
} from "@nestjs/common";
import { ShippingDetailsService } from "./shipping-details.service";
import { CreateShippingDetailDto } from "./dto/create-shipping-detail.dto";
import { UpdateShippingDetailDto } from "./dto/update-shipping-detail.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Request } from "express";
import { JwtPayload } from "../auth/interface";
import { Serializer } from "src/interceptors/serializer.interceptor";
import { ShippingDetail } from "./entities/shipping-detail.entity";
import { ROLE } from "generated/prisma/enums";
import { Roles } from "../auth/decorators/roles.decorators";

@Controller("shipping-details")
@Serializer(ShippingDetail)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLE.User)
export class ShippingDetailsController {
    constructor(
        private readonly shippingDetailsService: ShippingDetailsService
    ) { }

    @Post()
    async create(
        @Req() req: Request & { user: JwtPayload },
        @Body() createShippingDetailDto: CreateShippingDetailDto
    ) {
        const user = req.user;
        const data = await this.shippingDetailsService.create(
            createShippingDetailDto,
            user.sub
        );
        return {
            message: "Shipping detail created successfully",
            data: data,
        };
    }

    @Post("admin")
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    async createAdmin(
        @Body() createShippingDetailDto: CreateShippingDetailDto
    ) {
        if (!createShippingDetailDto.userId) {
            throw new BadRequestException("userId is required when creating as admin");
        }
        const data = await this.shippingDetailsService.create(
            createShippingDetailDto,
            createShippingDetailDto.userId
        );
        return {
            message: "Shipping detail created successfully",
            data: data,
        };
    }

    @Get("admin")
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    async findAllAdmin() {
        const data = await this.shippingDetailsService.findAllAdmin();
        return {
            message: "All shipping details fetched successfully",
            data: data,
        };
    }

    @Get()
    async find(@Req() req: Request & { user: JwtPayload }) {
        const user = req.user;
        const data = await this.shippingDetailsService.find(user.sub);
        return {
            message: "Shipping details fetched successfully",
            data: data,
        };
    }

    @Patch(":id")
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    async update(
        @Param("id") id: string,
        @Body() updateShippingDetailDto: UpdateShippingDetailDto
    ) {
        const data = await this.shippingDetailsService.update(
            id,
            updateShippingDetailDto
        );
        return {
            message: "Shipping detail updated successfully",
            data: data,
        };
    }

    @Delete(":id")
    async remove(
        @Req() req: Request & { user: JwtPayload },
        @Param("id") id: string
    ) {
        const user = req.user;
        const data = await this.shippingDetailsService.remove(id, user.sub);
        return {
            message: "Shipping detail removed successfully",
            data: data,
        };
    }
}
