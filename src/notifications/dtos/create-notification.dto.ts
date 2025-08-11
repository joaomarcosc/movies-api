import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsEnum(['MOVIE_RELEASED'])
  type: 'MOVIE_RELEASED';

  @IsNotEmpty()
  @IsDate()
  sendAt: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
