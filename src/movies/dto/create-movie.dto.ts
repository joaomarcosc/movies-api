import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsMilitaryTime()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  genres: string[];

  @IsNumber()
  @Min(0)
  popularity: number;

  @IsNumber()
  @Min(0)
  votes: number;

  @IsDateString()
  releaseDate: string;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsNumber()
  @Min(0)
  revenue: number;

  @IsNumber()
  profit: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  images: string[];

  @IsString()
  @IsNotEmpty()
  trailer: string;
}
