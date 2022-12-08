import {usersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";
import {UserEntity} from "../services/entities/user.entity";
import {UsersRepositoryInterface} from "./interfaces/users.repository.interface";

export const usersRepository: UsersRepositoryInterface = {
    findUserByEmailOrPassword: async (loginOrEmail: string): Promise<WithId<UserEntity> | null> => {
        console.log(`[findUserByEmailOrPassword]: loginOrEmail:${loginOrEmail}`);
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]});
    },
    createNewUser: async (user: UserEntity): Promise<string | null> => {
        const result = await usersCollection.insertOne(user);
        if (result.acknowledged) return result.insertedId.toString();
        return null;
    },
    deleteUserById: async (id: string): Promise<boolean> => {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)});
        return result.acknowledged;
    },
    getUserById: async (id: string): Promise<UserEntity | null> => {
        const result = await usersCollection.findOne({_id: new ObjectId(id)});
        if (!result) return null;
        return {
            login: result.login,
            email: result.email,
            passwordHash: result.passwordHash,
            passwordSalt: result.passwordSalt,
            createdAt: result.createdAt
        };
    }
};