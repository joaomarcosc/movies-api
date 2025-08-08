import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadFileDto } from './dto/upload-file.dto';
import * as path from 'path';
import { ValidateAwsEnvironmentReturn } from 'src/types/aws.types';

@Injectable()
export class AwsService {
  private allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  constructor(private readonly configService: ConfigService) {}

  private validateAwsConfig(): ValidateAwsEnvironmentReturn {
    const accessKey = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const region = this.configService.get<string>('AWS_REGION');
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    if (!accessKey || !secretKey || !region || !bucketName) {
      throw new HttpException(
        'AWS credentials or region not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { accessKey, secretKey, region, bucketName };
  }

  async generatePresignedUrl(uploadFileDto: UploadFileDto) {
    const { accessKey, secretKey, region, bucketName } =
      this.validateAwsConfig();

    const { name, ext } = path.parse(uploadFileDto.fileName);

    const fileKey = `uploads/${name}-${Date.now()}${ext}`;

    if (!this.allowedFileTypes.includes(uploadFileDto.fileType)) {
      throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
    }

    const s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: fileKey,
      ContentType: uploadFileDto.fileType,
    };

    const command = new PutObjectCommand(params);

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 5,
    });

    return {
      uploadUrl,
      fileKey,
    };
  }
}
