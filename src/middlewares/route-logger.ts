import { Request, Response, NextFunction } from 'express';
import { log } from '../classes/log.class';
export const LogRoutes = (req: Request, res: Response, next: NextFunction) => {

    log.info(req.method);

    log.info('params', req.url, req.params);
    log.info('query', req.url, req.query);

    return next();
}