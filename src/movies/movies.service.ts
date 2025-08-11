import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movies.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { NotificationsService } from 'src/notifications/notifications.service';
import { format } from 'date-fns';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    private readonly usersService: UsersService,

    private readonly notificationsService: NotificationsService,
  ) {}

  async createMovie(
    createMovieDTO: CreateMovieDto,
    userId: string,
  ): Promise<Movie> {
    const findExistingMovie = await this.movieRepository.findOne({
      where: { title: createMovieDTO.title },
    });

    if (findExistingMovie) {
      throw new ConflictException('Movie with this title already exists');
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const movie = this.movieRepository.create({
      ...createMovieDTO,
      user,
    });

    const createdMovie = await this.movieRepository.save(movie);

    const today = format(new Date(), 'yyyy-MM-dd');

    if (movie.releaseDate >= today) {
      await this.notificationsService.createNotification({
        type: 'MOVIE_RELEASED',
        sendAt: movie.releaseDate,
        message: JSON.stringify({
          title: movie.title,
          description: movie.description,
        }),
      });
    }

    return plainToInstance(Movie, createdMovie);
  }

  async findByReleaseDate(releaseDate: string): Promise<Movie[]> {
    return await this.movieRepository.find({
      where: { releaseDate },
    });
  }

  async updateMovie(
    updateMovieDto: UpdateMovieDto,
    movieId: string,
    userId: string,
  ): Promise<Movie> {
    console.log(updateMovieDto, movieId, userId);

    const movie = await this.movieRepository.findOne({
      where: {
        id: movieId,
        user: { id: userId },
      },
    });

    if (!movie) {
      throw new HttpException(
        'Movie not found or new date to update',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedMovie = Object.assign(movie, updateMovieDto);

    if (movie.title === updateMovieDto.title) {
      throw new ConflictException('Movie with this title already exists');
    }

    await this.movieRepository.save(updatedMovie);

    return plainToInstance(Movie, updatedMovie);
  }
}
