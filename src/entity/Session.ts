import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ImageSet } from './ImageSet';
import { v4 as uuid4 } from 'uuid';
import { User } from './User';
import { getExpires } from '../utils/getExpires';


@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sessionToken: string = uuid4();

  @Column()
  expires: number = getExpires();

  @ManyToOne(type => User, user => user.sessions, { eager: true })
  user!: User;

  updateExpires = async () => {
    this.expires = getExpires();
    await this.save();
  }
}
