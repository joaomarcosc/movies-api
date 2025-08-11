import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { DailyEmailsProcessor } from './queues/daily-emails/daily-emails.queue';

@Module({
  imports: [ConfigModule, BullModule.registerQueue({ name: 'daily-emails' })],
  providers: [EmailService, DailyEmailsProcessor],
  exports: [BullModule],
})
export class EmailModule {}
