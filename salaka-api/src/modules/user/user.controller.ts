import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Param,
  Patch,
  Delete,
  Body,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { FilterUsersDto } from "./dto/create-user.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Serializer } from "src/interceptors/serializer.interceptor";
import { User } from "./entities/user.entity";
import { JwtPayload } from "../auth/interface";
import { ROLE, USER_STATUS } from "generated/prisma/enums";
import { Roles } from "../auth/decorators/roles.decorators";

@Controller("user")
@Serializer(User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get("query")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async findByQuery(@Query() filter: FilterUsersDto) {
    const data = await this.userService.findByQuery(filter);
    return {
      message: "Users fetched successfully",
      data: data.users,
      totalCount: data.totalCount,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    };
  }

  @Get("/current")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findCurrentUser(@Req() req: Request & { user: JwtPayload }) {
    const currentUserId = req?.user?.sub;
    return this.userService.findCurrentUser(currentUserId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("Admin", "SuperAdmin")
  @Get("/status/:status")
  @HttpCode(HttpStatus.OK)
  findByStatus(@Param("status") status: USER_STATUS) {
    return this.userService.getUsersByStatus(status);
  }
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  findOne(@Param("id") id: string) {
    const user = this.userService.getUniqueUser(id);
    return {
      message: "User retrieved successfully",
      data: user,
    };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  update(@Param("id") id: string, @Body("status") status: USER_STATUS) {
    return this.userService.updateUserStatus(id, status);
  }
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    const result = await this.userService.remove(id);
    return {
      message: "User removed successfully",
      data: result,
    };
  }
}
