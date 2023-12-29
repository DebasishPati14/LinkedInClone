import { FeedEntity } from 'src/modules/feed/entities/feed.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum RolesEnum {
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hash: string;

  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USER })
  role: RolesEnum;

  @OneToMany(() => FeedEntity, (feedDetails) => feedDetails.author)
  feedPosts: FeedEntity[];
}
