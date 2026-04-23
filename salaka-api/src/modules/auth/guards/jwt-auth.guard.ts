import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "../interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const authHeader = request.headers?.authorization;
    if (!authHeader) return true;

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
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
