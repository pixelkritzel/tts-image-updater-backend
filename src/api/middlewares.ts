import { Session } from './../entity/Session';
import { NextFunction, Request, Response } from 'express';

import { Image } from './../entity/Image';
import { ImageSet } from './../entity/ImageSet';
import { User } from './../entity/User';

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const { username: usernameFromParams } = req.params;
  const sessionToken = req.headers['session-token'] as string;
  const sessionByToken = await Session.findOne({ sessionToken });
  if (sessionByToken) {
    if (usernameFromParams === sessionByToken.user.name && Date.now() < sessionByToken.expires) {
      sessionByToken.updateExpires();
      return next();
    }
  }
  res.statusCode = 401;
  res.send();
}

export async function resolveUser(req: Request, res: Response, next: NextFunction) {
  const { username } = req.params;
  if (username) {
    const user = await User.findOne({ name: username });
    if (!user) {
      res.statusCode = 404;
      res.send(`Didn't find user ${username}`);
    } else {
      req.locals = req.locals ?? {};
      req.locals.user = user;
      next();
    }
  } else {
    throw new Error('resolveUser middleware was used without a :username in the route');
  }
}

export async function resolveImageSet(req: Request, res: Response, next: NextFunction) {
  const { imageSetId } = req.params;
  if (!imageSetId) {
    throw new Error('resolveImageSet middleware was used without a :imageSet in the route');
  }
  if (!req.locals?.user) {
    throw new Error(
      'resolveImageSet middleware was used without a user instance on the request object'
    );
  }

  const imageSet = await ImageSet.findOne({ id: Number(imageSetId) });
  if (!imageSet) {
    res.statusCode = 404;
    res.send(`Didn't find image set ${imageSetId}`);
  } else {
    req.locals.imageSet = imageSet;
    next();
  }
}

export async function resolveImage(req: Request, res: Response, next: NextFunction) {
  const { imageId } = req.params;
  if (!imageId) {
    throw new Error('resolveImageSet middleware was used without a :mageId in the route');
  }
  if (!req.locals?.imageSet) {
    throw new Error(
      'resolveImageSet middleware was used without a imageSet instance on the request object'
    );
  }
  const image = await Image.findOne({ id: Number(imageId) });
  if (!image) {
    res.statusCode = 404;
    res.send(`Didn't find image ${imageId}`);
  } else {
    req.locals.image = image;
    next();
  }
}
