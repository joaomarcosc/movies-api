import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findAll(skip: number, take: number): Promise<User[]> {
    const users = await this.usersRepository.find({
      skip,
      take,
      select: ['email'],
    });

    if (!users.length) {
      throw new HttpException('Does dont have users', HttpStatus.BAD_REQUEST);
    }

    return users;
  }
}
