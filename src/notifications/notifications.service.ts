import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './notifications.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UsersService } from 'src/users/users.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Movie } from 'src/movies/movies.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly batchSize = 100;

  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,

    @InjectQueue('daily-emails')
    private readonly emailQueue: Queue,

    private readonly usersService: UsersService,
  ) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<void> {
    const notification = this.notificationsRepository.create(
      createNotificationDto,
    );
    await this.notificationsRepository.save(notification);

    this.logger.log(`Notification created: ${JSON.stringify(notification)}`);
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async notifyUsersOfReleasedMovies() {
    const releasedMovies = await this.notificationsRepository
      .createQueryBuilder('notification')
      .where('DATE(notification.sendAt) = CURRENT_DATE')
      .andWhere('notification.status IS NULL')
      .getMany();

    if (!releasedMovies.length) {
      return;
    }

    let offset = 0;
    const users = await this.usersService.findAll(offset, this.batchSize);

    if (!users.length) {
      this.logger.log('No users found to notify.');
      return;
    }

    for (const user of users) {
      let currentMovieId = '';
      for (const movie of releasedMovies) {
        const movieData = JSON.parse(movie.message) as Movie;
        if (movie.status !== 'SENT') {
          currentMovieId = `${movie.id}`;
          this.logger.log(
            `Sending notification to user ${user.email}: ${movieData.title}`,
          );
          void this.emailQueue.add(
            'daily-emails',
            {
              email: user.email,
              subject: 'Movie Released Today',
              content: `Movie released today: ${movieData.title}`,
            },
            {
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 1000,
              },
              removeOnComplete: 3600,
            },
          );
        }
      }

      await this.notificationsRepository.update(currentMovieId, {
        status: 'SENT',
      });
    }

    offset += this.batchSize;
  }
}
