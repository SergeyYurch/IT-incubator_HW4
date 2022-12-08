import * as dotenv from "dotenv";
import { WithId} from "mongodb";
import jwt from 'jsonwebtoken';
import {UserEntity} from "../services/entities/user.entity";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '1';

export const jwtService = {
    async createJWT(user: WithId<UserEntity>) {
        return jwt.sign({userId: user._id.toString()}, JWT_SECRET, {expiresIn: '10h'});
    },

    async getUserIdByJwtToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET);
            return result.userId;
        } catch (error) {
            return null;
        }
    }

};