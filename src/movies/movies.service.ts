import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movies.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async createMovie(createMovieDTO: CreateMovieDto): Promise<Movie> {
    const findExistingMovie = await this.movieRepository.findOne({
      where: { title: createMovieDTO.title },
    });

    console.log('Creating movie:', createMovieDTO);

    if (findExistingMovie) {
      throw new ConflictException('Movie with this title already exists');
    }

    const movie = this.movieRepository.create(createMovieDTO);

    return await this.movieRepository.save(movie);
  }
}
