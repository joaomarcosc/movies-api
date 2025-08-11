import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(
    email: string,
    subject: string,
    content: string,
  ): Promise<void> {
    const resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));

    await resend.emails.send({
      from:
        this.configService.get<string>('EMAIL_FROM') ?? 'default@example.com',
      to: email,
      subject,
      text: content,
    });
  }
}
