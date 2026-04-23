import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interface";

@Injectable()
export class CustomJwtService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessJwtToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
  generateRefreshJwtToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
  async generateAccessAndRefreshToken(payload: JwtPayload) {
    const access_token = await this.generateAccessJwtToken(payload);
    const refresh_token = await this.generateRefreshJwtToken(payload);
    return { access_token, refresh_token };
  }
  async verifyToken(token: string, secret: string) {
    return this.jwtService.verifyAsync(token, { secret });
  }
}
