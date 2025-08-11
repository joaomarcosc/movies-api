import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'send_at', type: 'timestamp with time zone' })
  sendAt: string;

  @Column({ type: 'enum', enum: ['SUCCESS', 'FAILURE'] })
  status: 'SUCCESS' | 'FAILURE';
}
