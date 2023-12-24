import { UserEntity } from 'src/modules/authentication/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => UserEntity, (user) => user.feedPosts)
  author: UserEntity;
}
