import { Session } from './Session';
import { ImageSet } from './ImageSet';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import { compare } from 'bcrypt';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  name!: string;

  @Column()
  pwHash!: string;

  @Column()
  imageDirectory!: string;

  @OneToMany((type) => ImageSet, (imageSet) => imageSet.user, { eager: true })
  imageSets!: ImageSet[];

  @OneToMany(type => Session, session => session.user, { nullable: true })
  sessions!: Session[];

  constructor(name: string, pwHash: string) {
    super();
    this.name = name;
    this.pwHash = pwHash;
    this.imageDirectory = uuid4();
  }

  toJSON = () => {
    const copy: Partial<User> = { ...this };
    delete copy.pwHash;
    return copy;
  };

  login = async (password: string) => {
    if (await compare(password, this.pwHash)) {
      const session = new Session;
      session.user = this;
      await session.save();
      this.sessions = [...(this.sessions ?? []), session]
      return { type: 'SUCCESS', data: { sessionToken: session.sessionToken } };
    } else {
      return { type: 'ERROR', message: 'Wrong password' };
    }
  };
}
