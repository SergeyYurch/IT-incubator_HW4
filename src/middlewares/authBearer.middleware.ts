import {Request, Response, NextFunction} from 'express';
import {jwtService} from "../helpers/jwt-service";
import {usersService} from "../services/users.service";

export const authBearerMiddleware =async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return
    }
    const token= req.headers.authorization.split(' ')[1]
    const userId=await jwtService.getUserIdByJwtToken(token);
    if (userId) {
        req.user= await usersService.getUserById(userId)
        return next()
    }
    res.sendStatus(401);
};