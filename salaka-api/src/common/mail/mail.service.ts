import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendPasswordResetEmail(
    email: string,
    token: string,
  ) {
    try {
      const resetLink =
        `${process.env.FRONTEND_URL}/admin/reset-password?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        from: process.env.MAIL_USER,
        subject: "Reset Your Password",
        html: `
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password:</p>

          <a href="${resetLink}">
            Reset Password
          </a>

          <p>This link expires in 30 minutes.</p>
        `,
      });

      return true;
    } catch (error) {

    console.log("MAIL ERROR:", error);
      throw new InternalServerErrorException(
        "Failed to send email",
      );
    }
  }
}
