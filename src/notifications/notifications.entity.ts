import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ enum: ['MOVIE_RELEASED'], nullable: false })
  type: 'MOVIE_RELEASED';

  @Column({ nullable: false })
  message: string;

  @Column({ name: 'send_at', type: 'timestamp with time zone' })
  sendAt: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
