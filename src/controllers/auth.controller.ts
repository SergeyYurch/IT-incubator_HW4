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
        const result = await checkCredentials({loginOrEmail, password});
        return result ? res.status(201).json(result) : res.sendStatus(500);
    });

