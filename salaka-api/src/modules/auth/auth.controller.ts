import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { LoginAuthDto } from "./dto/auth-login.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Get("google/login")
  @HttpCode(HttpStatus.OK)
  async getGoogleLoginUrl() {
    const res = await this.authService.googleAuthUrl();
    return { message: "Google login URL", data: res };
  }

  @Get("google/login/redirect")
  @HttpCode(HttpStatus.OK)
  async googleLoginRedirect(
    @Req() req: Request & { query: { code: string } },
    @Res() res: Response
  ) {
    const code = req.query.code;
    const frontendUrl = this.configService.get<string>("client.clientUrl");
    try {
      const result = await this.authService.getUser(code);
      return res.redirect(
        `${frontendUrl}/auth/success?access_token=${result.access_token}&refresh_token=${result.refresh_token}`
      );
    } catch (error) {
      const message = error.response?.message || error.message || "Login failed";
      return res.redirect(
        `${frontendUrl}/auth/login?error=${encodeURIComponent(message)}`
      );
    }
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: LoginAuthDto) {
    const result = await this.authService.signInUser(body);
    return { message: "User signed in successfully", data: result };
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUser: CreateAuthDto) {
    const result = await this.authService.registerUser(createUser);
    return { message: "User registered successfully", data: result };
  }

  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body("refreshToken") refreshToken: string) {
    const result = await this.authService.refreshTokens(refreshToken);
    return { message: "Tokens refreshed successfully", data: result };
  }
}

