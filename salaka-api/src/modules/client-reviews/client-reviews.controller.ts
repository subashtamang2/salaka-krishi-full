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
import { ClientReviewsService } from "./client-reviews.service";
import { CreateClientReviewDto } from "./dto/create-client-review.dto";
import { UpdateClientReviewDto } from "./dto/update-client-review.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtPayload } from "../auth/interface";
import { ROLE } from "generated/prisma/enums";
import { Roles } from "../auth/decorators/roles.decorators";

@Controller("client-reviews")
export class ClientReviewsController {
  constructor(private readonly clientReviewsService: ClientReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async create(
    @Body() createClientReviewDto: CreateClientReviewDto,
    @Req() { user }: { user: JwtPayload }
  ) {
    const clientReview = await this.clientReviewsService.create(
      createClientReviewDto,
      user
    );
    return {
      message: "Client review created successfully",
      data: clientReview,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const clientReviews = await this.clientReviewsService.findAll();
    return {
      message: "Client reviews fetched successfully",
      data: clientReviews,
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const result = await this.clientReviewsService.findOne(id);
    return {
      message: `Client review with id ${id} fetched successfully`,
      data: result,
    };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async update(
    @Param("id") id: string,
    @Body() updateClientReviewDto: UpdateClientReviewDto
  ) {
    const result = await this.clientReviewsService.update(
      id,
      updateClientReviewDto
    );
    return {
      message: `Client review with id ${id} updated successfully`,
      data: result,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    const result = await this.clientReviewsService.remove(id);
    return {
      message: `Client review with id ${id} deleted successfully`,
      data: result,
    };
  }
}
