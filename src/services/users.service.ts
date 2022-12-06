import {UserEntity} from "./entities/user.entity";
import bcrypt from 'bcrypt';
import {LoginInputModel} from "../controllers/dto/loginInputModel.dto";
import {usersRepository} from "../repositories/users.repository";
import {UserViewModelDto} from "../controllers/dto/userViewModel.dto";
import {generateHash} from "../helpers/helpers";
import {UsersServiceInterface} from "./users.service.interface";

const {findUserByEmailOrPassword, createNewUser, deleteUserById, getUserById} = usersRepository;

export const usersService:UsersServiceInterface = {
    async createUser(login: string, email: string, password: string): Promise<UserViewModelDto | null> {
        const createdAt = new Date().toISOString();
        const passwordSalt = await bcrypt.genSalt(10);
        debugger
        const passwordHash = await generateHash(password, passwordSalt);
        const newUser: UserEntity = {
            login, email, passwordHash, createdAt, passwordSalt
        };
        const result = await createNewUser(newUser);
        if (result) return {
            id: result,
            login, email, createdAt
        };
        return null;
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await deleteUserById(id);
    },

    async findUserByEmailOrPassword(loginOrEmail: string): Promise<UserViewModelDto | null> {
        const result = await findUserByEmailOrPassword(loginOrEmail);
        if (!result) return null;
        return {
            id: result._id.toString(),
            login: result.login,
            email: result.email,
            createdAt: result.createdAt
        };
    },

    async getUserById(id: string): Promise<UserViewModelDto | null> {
        const result = await getUserById(id);
        if (!result) return null;
        const {login, email, createdAt} = result;
        return {
            id,
            login,
            email,
            createdAt
        };
    },

    async checkCredentials(credentials: LoginInputModel): Promise<boolean> {
        const {loginOrEmail, password} = credentials;
        const user = await findUserByEmailOrPassword(loginOrEmail);
        if (!user) return false;
        const passwordHash = await generateHash(password, user.passwordSalt);
        return passwordHash === user.passwordHash;
    },

};
