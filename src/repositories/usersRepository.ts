import {usersCollection} from "./db";
import {ObjectId, WithId} from "mongodb";
import {UserEntity} from "../services/entities/user.entity";
import {UsersRepositoryInterface} from "./usersRepository.interface";

export const usersRepository: UsersRepositoryInterface = {
    findUserByEmailOrPassword: async (loginOrEmail: string): Promise<WithId<UserEntity> | null> => {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]});
    },
    createNewUser: async (user: UserEntity): Promise<string | null> => {
        const result = await usersCollection.insertOne(user);
        if (result.acknowledged) return result.insertedId.toString();
        return null;
    },
    deleteUserById: async (id: string): Promise<boolean> => {
        const result = await usersCollection.deleteOne(new ObjectId(id));
        return result.acknowledged;
    }
};