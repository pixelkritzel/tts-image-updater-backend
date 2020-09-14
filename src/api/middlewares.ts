import { NextFunction, Request, Response } from 'express';

import { store } from '../store';

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const { username: usernameFromParams } = req.params;
  const sessiontoken = req.headers['session-token'];
  const sessionByToken = store.activeSessions.get(sessiontoken as string);
  if (typeof sessiontoken === 'string' && sessionByToken) {
    if (usernameFromParams === sessionByToken.username && Date.now() < sessionByToken.expires) {
      store.users.get(sessionByToken.username)?.session!.updateExpires();
      return next();
    }
  }
  res.statusCode = 401;
  res.send();
}

export async function resolveUser(req: Request, res: Response, next: NextFunction) {
  const { username } = req.params;
  if (username) {
    const user = store.users.get(username);
    if (!user) {
      res.statusCode = 404;
      res.send(`Didn't find user ${username}`);
    } else {
      req.user = user;
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
  if (!req.user) {
    throw new Error(
      'resolveImageSet middleware was used without a user instance on the request object'
    );
  }

  const imageSet = req.user.imageSets.get(imageSetId);
  if (!imageSet) {
    res.statusCode = 404;
    res.send(`Didn't find image set ${imageSetId}`);
  } else {
    req.imageSet = imageSet;
    next();
  }
}

export async function resolveImage(req: Request, res: Response, next: NextFunction) {
  const { imageId } = req.params;
  if (!imageId) {
    throw new Error('resolveImageSet middleware was used without a :mageId in the route');
  }
  if (!req.imageSet) {
    throw new Error(
      'resolveImageSet middleware was used without a imageSet instance on the request object'
    );
  }
  const image = req.imageSet.images.get(imageId);
  if (!image) {
    res.statusCode = 404;
    res.send(`Didn't find image ${imageId}`);
  } else {
    req.image = image;
    next();
  }
}
