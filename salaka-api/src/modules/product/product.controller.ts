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
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto, FilterProductsDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtPayload } from "../auth/interface";
import { Serializer } from "src/interceptors/serializer.interceptor";
import { Product } from "./entities/product.entity";
import { PRODUCT_FILTER } from "./product.enum";
import { ROLE } from "generated/prisma/enums";
import { Roles } from "../auth/decorators/roles.decorators";

@Controller("product")
@Serializer(Product)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin, ROLE.User)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request & { user: JwtPayload }
  ) {
    const user = req.user;
    const product = await this.productService.create(createProductDto, user);

    return {
      message: "Product created successfully",
      data: product,
    };
  }

  @Get("query")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findByQuery(
    @Query() filter: FilterProductsDto,
    @Req() req: Request & { user?: JwtPayload }
  ) {
    const user = req?.user;
    const products = await this.productService.findByQuery(filter, user);
    return {
      message: "Products fetched successfully",
      data: products || [],
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async findAll(@Req() req: Request & { user: JwtPayload }) {
    const user = req?.user;
    const products = await this.productService.findAll(user);
    return {
      message: "Products fetched successfully",
      data: products || [],
    };
  }
  @Get("slug/:slug")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findProductBySlug(
    @Param("slug") slug: string,
    @Req() req: Request & { user?: JwtPayload }
  ) {
    const user = req?.user;
    const products = await this.productService.findProductBySlug(slug, user);
    return {
      message: "Products fetched successfully",
      data: products,
    };
  }
  @Get("filter/:filterType")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findFilterProducts(
    @Req() req: Request & { user?: JwtPayload },
    @Param("filterType") filterType: PRODUCT_FILTER
  ) {
    const user = req?.user;
    const products = await this.productService.filterProducts(filterType, user);
    return {
      message: "Products fetched successfully",
      data: products || [],
    };
  }


  @Get("/featured")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findFeatured(@Req() req: Request & { user?: JwtPayload }) {
    const user = req?.user;
    const products = await this.productService.findFeatured(user);
    return {
      message: "Featured products fetched successfully",
      data: products,
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const product = await this.productService.findOne(id);
    return {
      message: `Product fetched successfully`,
      data: product,
    };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Req() req: Request & { user: JwtPayload },
    @Body() updateProductDto: UpdateProductDto
  ) {
    const user = req.user;
    const data = await this.productService.update(id, user, updateProductDto);
    return {
      message: `Product updated successfully`,
      data: data,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param("id") id: string,
    @Req() req: Request & { user: JwtPayload }
  ) {
    const user = req.user;
    const deleteProduct = await this.productService.remove(id, user);
    return {
      message: `Product deleted successfully`,
      data: deleteProduct,
    };
  }
}
