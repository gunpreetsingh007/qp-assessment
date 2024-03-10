import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { db } from '../database/connection';

declare global {
    namespace Express {
        interface Request {
            currentUser?: any
        }
    }
}
export const CurrentUser = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({"message": "Please provide a valid token."});
    }
    let jwtPayload: JwtPayload | string;
    try{
        jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string);
    }
    catch(err){
        return res.status(401).send({"message": "Please provide a valid token."});
    }
                    
    if (typeof jwtPayload === 'string') {
        return res.status(401).send({"message": "Please provide a valid token."});
    }

    db.dbInterface.models.User.findOne({
        where : {
            id: jwtPayload.id
        },
        attributes: ['id', 'username', 'role'],
        raw: true,
    })
    .then((user : any) => {
        req.currentUser = user;
        return next();
    }).catch((error:any) => {
        return res.status(500).send({"message": "Error fetching user details."});
    })
}