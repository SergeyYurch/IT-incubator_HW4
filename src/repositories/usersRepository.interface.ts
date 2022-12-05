import {WithId} from "mongodb";
import {UserEntity} from "../services/entities/user.entity";

export interface UsersRepositoryInterface {
    findUserByEmailOrPassword: (loginOrEmail: string) => Promise<WithId<UserEntity> | null>,
    createNewUser: (user: UserEntity) => Promise<string | null>;
    deleteUserById: (id: string) => Promise<boolean>;
}