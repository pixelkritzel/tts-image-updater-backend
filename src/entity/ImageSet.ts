import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Image } from './Image';
import { User } from './User';

@Entity()
export class ImageSet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: '' })
  name!: string;

  @OneToOne((type) => Image, (image) => image.imageSet, { eager: true, nullable: true })
  @JoinColumn()
  selectedImage!: Image;

  @OneToMany((type) => Image, (image) => image.imageSet, { eager: true })
  images!: Image[];

  @ManyToOne((type) => User, (user) => user.imageSets)
  user!: User;

  toJSON = () => {
    const copy: any = { ...this };
    copy.selectedImage = copy.selectedImage && copy.selectedImage.id;
    return copy;
  };
}
