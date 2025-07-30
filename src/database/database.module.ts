import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './database.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forRootAsync(typeOrmAsyncConfig)],
})
export class DatabaseModule {}
