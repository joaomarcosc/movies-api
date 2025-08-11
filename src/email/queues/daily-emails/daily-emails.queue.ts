import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from 'src/email/email.service';

@Processor('daily-emails')
@Injectable()
export class DailyEmailsProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(
    job: Job<{ email: string; subject: string; content: string }>,
  ): Promise<void> {
    const { email, subject, content } = job.data;

    try {
      await this.emailService.sendEmail(email, subject, content);
    } catch (error) {
      console.error(`Failed to process job ${job.id}:`, error);
    }
  }
}
