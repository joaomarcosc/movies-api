import { Exclude } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  duration: string;

  @Column()
  language: string;

  @Column('text', { array: true })
  genres: string[];

  @Column({ type: 'float', default: 0 })
  popularity: number;

  @Column({ type: 'int', default: 0 })
  votes: number;

  @Column({ type: 'date' })
  releaseDate: string;

  @Column({ type: 'float', default: 0 })
  budget: number;

  @Column({ type: 'float', default: 0 })
  revenue: number;

  @Column({ type: 'float', default: 0 })
  profit: number;

  @Column('text', { array: true })
  images: string[];

  @Column({ nullable: true })
  trailer: string;

  @ManyToOne(() => User, (user) => user.movies, { onDelete: 'CASCADE' })
  @Exclude()
  user: User;
}
