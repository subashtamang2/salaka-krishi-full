import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "../interface";

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const authHeader = request.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return true; // Allow access without token
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return true; // Allow access with malformed header
    }

    try {
      const secretKey = this.configService.get<string>(
        "jwt.access_token_secret"
      );
      const decoded = this.jwtService.verify(token, {
        secret: secretKey,
      });
      request.user = decoded;
    } catch (error) {
      // Ignore invalid tokens for optional auth
    }

    return true;
  }
}
