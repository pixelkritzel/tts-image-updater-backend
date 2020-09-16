import { NextFunction, RequestHandler } from 'express';

export const exclude = function (path: string, middleware: RequestHandler) {
  return function (req: any, res: any, next: NextFunction) {
    const pathCheck = req.url.startsWith(path);
    pathCheck ? next() : middleware(req, res, next);
  };
};
