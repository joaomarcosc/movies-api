import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AwsService } from './aws.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get('generate-presigned-url')
  @UseGuards(JwtAuthGuard)
  async generatePresignedUrl(@Body() uploadFileDto: UploadFileDto) {
    try {
      return await this.awsService.generatePresignedUrl(uploadFileDto);
    } catch (error) {
      throw new HttpException(
        'Error generating presigned URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
