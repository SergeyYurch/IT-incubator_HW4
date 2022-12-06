import {Router,  Response} from "express";
import {validatorMiddleware} from "../middlewares/validator.middleware";
import {RequestWithBody} from "../types/request.type";
import {LoginInputModel} from "./dto/loginInputModel.dto";
import {usersService} from "../services/users.service";

export const authRouter = Router();

const {
    validateAuthInputModel,
    validateResult
} = validatorMiddleware;
const {checkCredentials} = usersService;

authRouter.post('/login',
    validateAuthInputModel(),
    validateResult,
    async (req: RequestWithBody<LoginInputModel>, res: Response) => {
        const { loginOrEmail, password} = req.body;
        console.log(`authRouter login:${loginOrEmail}, pass: ${password}`);
        const result = await checkCredentials({loginOrEmail, password});
        console.log(`authRouter checkCredentials: ${result}`);

        return result ? res.sendStatus(204) : res.sendStatus(401);
    });

