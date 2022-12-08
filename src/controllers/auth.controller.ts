import {Router,  Response} from "express";
import {validatorMiddleware} from "../middlewares/validator.middleware";
import {RequestWithBody} from "../types/request.type";
import {LoginInputModel} from "./dto/loginInputModel.dto";
import {usersService} from "../services/users.service";
import {jwtService} from "../helpers/jwt-service";

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
        console.log(`!!!![authRouter] login:${loginOrEmail}, pass: ${password}`);
        debugger
        const user = await checkCredentials({loginOrEmail, password});
        if (user){
            const token= await jwtService.createJWT(user)
            return res.status(200).send({
                "accessToken": token
            })
        } else {
            return res.sendStatus(401);
        }
    });

