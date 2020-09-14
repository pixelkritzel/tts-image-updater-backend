import { Iimage, IimageSet } from './../../src/store/imageSet';
import { Iuser } from '../../src/store/user';

declare module 'express-serve-static-core' {
  interface Request {
    image?: Iimage;
    imageSet?: IimageSet;
    user?: Iuser;
  }
}
