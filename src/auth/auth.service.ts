import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SigninUserDto } from './dto/signin-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/jwt.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signinUserDto: SigninUserDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(signinUserDto.email);
    const passwordMatch = await bcrypt.compare(
      signinUserDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }
}
