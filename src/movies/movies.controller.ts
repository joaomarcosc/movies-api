import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movies.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  createMovie(
    @Body() createMovieDto: CreateMovieDto,
    @Request() req: { user: { userId: string } },
  ): Promise<Movie> {
    try {
      return this.moviesService.createMovie(createMovieDto, req.user.userId);
    } catch (error) {
      throw new HttpException(
        'Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  updateMovie(
    @Body() updateMovieDto: UpdateMovieDto,
    @Param('id') movieId: string,
    @Request() req: { user: { userId: string } },
  ): Promise<Movie> {
    try {
      return this.moviesService.updateMovie(
        updateMovieDto,
        movieId,
        req.user.userId,
      );
    } catch (error) {
      throw new HttpException(
        'Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteMovie(
    @Param('id') movieId: string,
    @Request() req: { user: { userId: string } },
  ): Promise<void> {
    try {
      await this.moviesService.delete(movieId, req.user.userId);
    } catch (error) {
      throw new HttpException(
        'Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
