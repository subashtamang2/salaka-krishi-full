import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
} from "@nestjs/common";
import { OverallReviewsService } from "./overall-reviews.service";
import { JwtAuthGuard } from "../modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../modules/auth/guards/roles.guard";
import { ROLE } from "@prisma/client";
import { Roles } from "../modules/auth/decorators/roles.decorators";
import { CreateOverallReviewDto } from "./dto/create-overall-review.dto";
import { JwtPayload } from "../modules/auth/interface";
import { UpdateOverallReviewDto } from "./dto/update-overall-review.dto";
@Controller("overall-reviews")
export class OverallReviewsController {
    constructor(private readonly overallReviewsService: OverallReviewsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.User)
    async create(
        @Body() createOverallReviewDto: CreateOverallReviewDto,
        @Req() { user }: { user: JwtPayload }
    ) {
        const overallReview = await this.overallReviewsService.create(
            createOverallReviewDto,
            user
        );
        return {
            message: "Oveall-client review created successfully",
            data: overallReview,
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
        const overallReviews = await this.overallReviewsService.findAll();
        return {
            message: "Overall  reviews fetched successfully",
            data: overallReviews,
        };
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async findOne(@Param("id") id: string) {
        const result = await this.overallReviewsService.findOne(id);
        return {
            message: `Overall review with id ${id} fetched successfully`,
            data: result,
        };
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    async update(
        @Param("id") id: string,
        @Body() updateOverallReviewDto: UpdateOverallReviewDto
    ) {
        const result = await this.overallReviewsService.update(
            id,
            updateOverallReviewDto
        );
        return {
            message: `Overall review with id ${id} updated successfully`,
            data: result,
        };
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin, ROLE.SuperAdmin)
    @HttpCode(HttpStatus.OK)
    async remove(@Param("id") id: string) {
        const result = await this.overallReviewsService.remove(id);
        return {
            message: `Overall review with id ${id} deleted successfully`,
            data: result,
        };
    }
}
