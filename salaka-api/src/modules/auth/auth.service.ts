import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { AuthRepository } from "./auth.repository";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { LoginAuthDto } from "./dto/auth-login.dto";
import * as bcrypt from "bcrypt";
import { CustomJwtService } from "./CustomJwt.service";

@Injectable()
export class AuthService {
  private oauth2Client: any;
  constructor(
    private readonly repository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: CustomJwtService
  ) {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: this.configService.get<string>("google.client_id"),
      clientSecret: this.configService.get<string>("google.client_secret"),
      redirectUri: this.configService.get<string>("google.login_callback_url"),
    });
  }
  setCredentials(access_token: string, refresh_token: string) {
    this.oauth2Client.setCredentials({
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }
  async googleAuthUrl() {
    const authUrl = await this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
      prompt: "consent",
    });
    return authUrl;
  }
  async getTokens(code: string) {
    const token = await this.oauth2Client.getToken(code);
    return token;
  }
  async getUser(code: string) {
    const { tokens } = await this.getTokens(code);
    const { access_token, refresh_token } = tokens;
    this.setCredentials(access_token!, refresh_token!);

    const user = await google
      .oauth2({ version: "v2", auth: this.oauth2Client })
      .userinfo.get();
    const payload: CreateAuthDto = {
      email: user.data.email!,
      firstName: user.data.given_name!,
      lastName: user?.data?.family_name ?? "",
      profileUrl: user?.data?.picture ?? "",
      isGoogleLogin: true,
    };

    const existingUser = await this.repository.findGoogleLoginUser(
      payload.email
    );

    if (!existingUser) await this.registerUser(payload);

    if (!existingUser)
      throw new InternalServerErrorException("Unable to login user");

    const { access_token: a_token, refresh_token: r_token } =
      await this.jwtService.generateAccessAndRefreshToken({
        sub: existingUser.id,
        username: existingUser.firstName,
        role: existingUser.role,
      });
    return { access_token: a_token, refresh_token: r_token };
  }
  async registerUser(createUser: CreateAuthDto) {
    const existingUser = await this.repository.findUserByEmail(createUser.email);
    if (existingUser)
      throw new ConflictException("User already exists");

    const user = await this.repository.registerUser(createUser);
    if (!user) {
      throw new InternalServerErrorException("Failed to register user");
    }

    const { access_token, refresh_token } =
      await this.jwtService.generateAccessAndRefreshToken({
        sub: user.id,
        username: user.firstName,
        role: user.role,
      });

    return { access_token, refresh_token };
  }

  async signInUser(loginUser: LoginAuthDto) {
    const user = await this.repository.findUserByEmail(loginUser.email);
    if (!user) throw new NotFoundException("No account found. Please sign up first.");

    if (!user.password) {
      throw new UnauthorizedException("This account was created via social login. Please login with Google/Facebook.");
    }

    const isPasswordValid = await bcrypt.compare(
      loginUser.password,
      user.password
    );
    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid credentials");

    const { access_token, refresh_token } =
      await this.jwtService.generateAccessAndRefreshToken({
        sub: user.id,
        username: user.firstName,
        role: user.role,
      });
    return { access_token, refresh_token };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const secret = this.configService.get<string>("jwt.refresh_token_secret");
      const payload = await this.jwtService.verifyToken(refreshToken, secret!);
      
      const user = await this.repository.findUserById(payload.sub);
      if (!user) throw new UnauthorizedException("User not found");

      return this.jwtService.generateAccessAndRefreshToken({
        sub: user.id,
        username: user.firstName,
        role: user.role,
      });
    } catch (e) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }
}
