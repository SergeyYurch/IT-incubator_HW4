import {Router, Request, Response} from "express";
import {validatorMiddleware} from "../middlewares/validator.middleware";
import {
    RequestWithBody,
    RequestWithId
} from "../types/request.type";
import {queryRepository} from "../repositories/query.repository";
import {PaginatorOptionInterface} from "../repositories/interfaces/query.repository.interface";
import {parseQueryPaginator} from "../helpers/helpers";
import {ObjectId} from "mongodb";
import {usersService} from "../services/users.service";
import {UserInputModelDto} from "./dto/userInputModel.dto";
import {authBearerMiddleware} from "../middlewares/authBearer.middleware";

export const commentsRouter = Router();

const {
    validateCommentInputModel,
    validateResult
} = validatorMiddleware;
const {createUser, deleteUserById, findUserByEmailOrPassword, getUserById} = usersService;
const {getAllUsers} = queryRepository;


commentsRouter.put('/:commentId',
    authBearerMiddleware,
    validateCommentInputModel(),
    validateResult,
    async (req: RequestWithBody<UserInputModelDto>, res: Response) => {
        const {login, password, email} = req.body;
        if (await findUserByEmailOrPassword(login)
            || await findUserByEmailOrPassword(email)) return res.sendStatus(400);
        const result = await createUser(login, email, password);
        return result ? res.status(201).json(result) : res.sendStatus(500);
    });


commentsRouter.get('/:commentId',
    async (req: Request, res: Response) => {
    const searchLoginTerm: string | null = req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : null;
    const searchEmailTerm: string | null = req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : null;
    const paginatorOption: PaginatorOptionInterface = parseQueryPaginator(req);
    const result = await getAllUsers(paginatorOption, searchLoginTerm, searchEmailTerm);
    return res.status(200).json(result);
});

commentsRouter.delete('/:id',
    authBearerMiddleware,
    async (req: RequestWithId, res: Response) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.sendStatus(404);
    const isExistUser = await getUserById(id);
    if (!isExistUser) return res.sendStatus(404)
    const result = await deleteUserById(id);
    return result ? res.sendStatus(204) : res.sendStatus(401);
});
