import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('feed_post')
export class FeedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  post: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
