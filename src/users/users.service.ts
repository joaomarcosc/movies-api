import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = bcrypt.hashSync(createUserDto.password, 10);

    const user = await this.usersRepository.save({
      ...createUserDto,
      password,
    });

    const userWithoutPassword = plainToInstance(User, user);

    return userWithoutPassword;
  }
}
