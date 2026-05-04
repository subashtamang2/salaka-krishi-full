import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "../interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const authHeader = request.headers?.authorization;
    if (!authHeader) throw new UnauthorizedException("Unauthorized access");

    if (!authHeader.startsWith("Bearer "))
      throw new UnauthorizedException("Unauthorized access");

    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthorizedException("Token is missing");
    try {
      const secretKey = this.configService.get<string>(
        "jwt.access_token_secret"
      );
      const decoded = this.jwtService.verify(token, {
        secret: secretKey,
      });
      request.user = decoded;

      // New: Verify user actually exists in the database
      const userExists = await this.prisma.user.findUnique({
        where: { id: decoded.sub }
      });
      if (!userExists) {
        throw new UnauthorizedException("User no longer exists");
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
