import { NextFunction, RequestHandler } from 'express';

export const exclude = function (pathes: string[], middleware: RequestHandler) {
  return function (req: any, res: any, next: NextFunction) {
    const pathCheck = pathes.some((path) => req.url.startsWith(path));
    pathCheck ? next() : middleware(req, res, next);
  };
};
