import { Request, Response, NextFunction } from 'express';

export const AdminRoleRequired = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        return res.status(401).send({ message: 'Please provide a valid token.' });
    }
    if (req.currentUser.role !== 'admin') {
        return res.status(403).send({ message: 'You do not have the permission to perform this action.' });
    }
    return next();
}