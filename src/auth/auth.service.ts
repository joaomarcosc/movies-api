import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SigninUserDto } from './dto/signin-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/jwt.types';
import { User } from 'src/users/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(
    signinUserDto: SigninUserDto,
  ): Promise<{ accessToken: string; user: User; refreshToken: string }> {
    const user = await this.usersService.findByEmail(signinUserDto.email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

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
    const refreshToken = await this.createRefreshToken(user);

    return {
      user: plainToInstance(User, user),
      accessToken,
      refreshToken,
    };
  }

  private async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const isMatched = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    return isMatched;
  }

  private async createRefreshToken(user: User): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '7d' },
    );

    user.hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(user);

    return refreshToken;
  }

  async refreshToken(refreshToken: string) {
    const decoded = this.jwtService.decode<JwtPayload>(refreshToken);
    const isValidToken = await this.validateRefreshToken(
      decoded.sub,
      refreshToken,
    );

    if (!isValidToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const newAccessToken = this.jwtService.sign({
      email: decoded.email,
      sub: decoded.sub,
    });

    return { accessToken: newAccessToken };
  }
}
