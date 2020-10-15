import { Image } from './../../src/entity/Image';
import { ImageSet } from './../../src/entity/ImageSet';
import { User } from './../../src/entity/User';

declare module 'express-serve-static-core' {
  interface Request {
    locals?: {
      image?: Image;
      imageSet?: ImageSet;
      user?: User;
    };
  }
}
