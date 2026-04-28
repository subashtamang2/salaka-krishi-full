import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { FilterAdminsDto } from "./dto/create-admin.dto";
import { LoginAdminDto } from "./dto/login-auth.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { Serializer } from "../../interceptors/serializer.interceptor";
import { AdminReponse } from "./entities/admin.entity";
import { UpdateAdminDto } from "./dto/update-admin";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("login")
  loginAdmin(@Body() body: LoginAdminDto) {
    return this.adminService.login(body);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // JwtAuthGuard to protect this route
  @Roles("SuperAdmin")
  async create(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.adminService.create(createAdminDto);
    return {
      message: "Admin created successfully",
      data: admin,
    };
  }

@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("Admin", "SuperAdmin")
@Serializer(AdminReponse)
async findAll(){
const data = await this.adminService.findAll();
return {
message: "Admins fetched successfully",
data,
};
}

@Get("query")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("Admin", "SuperAdmin")
async findByQuery(@Query() filter: FilterAdminsDto) {
  const data = await this.adminService.findByQuery(filter);
  return {
    message: "Admins fetched successfully",
    data: data.admins,
    totalCount: data.totalCount,
    page: data.page,
    limit: data.limit,
    totalPages: data.totalPages,
  };
}

@Get(":id")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("Admin", "SuperAdmin")
@Serializer(AdminReponse)
async findOne(@Param("id") id: string){
const admin = await this.adminService.findOne(id);
return {
message: "Admin fetched successfully",
data: admin,
};
}

@Patch(":id")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("Admin", "SuperAdmin")
@Serializer(AdminReponse)
async update(
@Param("id") id: string,
@Body() UpdateAdminDto: UpdateAdminDto
){
const admin = await this.adminService.update(id, UpdateAdminDto);
return{
message: "Admin updated successfully",
data: admin,
};
}
@Delete(":id")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("SuperAdmin")
async remove(@Param("id") id: string) {
const admin = await this.adminService.remove(id);
return {
message: "Admin removed successfully",
data: admin,
};
}

}
