import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { ImageSet } from './ImageSet';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column({ default: '' })
  name!: string;

  @ManyToOne((type) => ImageSet, (imageset) => imageset.images)
  imageSet!: ImageSet;

  constructor(url: string, imageSet: ImageSet) {
    super();
    this.url = url;
    this.imageSet = imageSet;
  }
}
