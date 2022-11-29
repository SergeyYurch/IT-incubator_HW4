import {Router, Request, Response} from "express";
import {validatorMiddleware} from "../middlewares/validator.middleware";
import {postsService} from "../services/postsService";
import {PostInputModelDto} from "./dto/postInputModel.dto";
import {
    RequestWithBody, RequestWithId,
    RequestWithIdAndBody
} from "../types/request.type";

export const postsRouter = Router();
const {validatePostInputModel, validateResult} = validatorMiddleware;
const {deletePostById, getAllPosts, editPostById, getPostById, createNewPost} = postsService;

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts =  await getAllPosts();
    return res.status(200).json(posts);
});

postsRouter.post('/', validatePostInputModel(),validateResult,async (req: RequestWithBody<PostInputModelDto>, res: Response) => {
    const {title, shortDescription, content, blogId} = req.body;
    const createdPost = await createNewPost({title, shortDescription, content, blogId});
    return createdPost ? res.status(201).json(createdPost) : res.sendStatus(500);
});

postsRouter.get('/:id', async (req: RequestWithId, res: Response) => {
    const id = req.params.id;
    const result = await getPostById(id);
    return result ? res.status(200).json(result) : res.sendStatus(404);
});

postsRouter.put('/:id', validatePostInputModel(), validateResult,async (req: RequestWithIdAndBody<PostInputModelDto>, res: Response) => {
    const id = req.params.id;
    if (!(await getPostById(id))) return res.sendStatus(404);
    const body = req.body;
    const post: PostInputModelDto = {
        title: body.title,
        blogId: body.blogId,
        content: body.content,
        shortDescription: body.shortDescription
    };
    const result =await editPostById(id, post)
    return  result? res.sendStatus(204) : res.sendStatus(404);
});

postsRouter.delete('/:id',async (req: RequestWithId, res: Response) => {
    const id = req.params.id;
    if (!(await getPostById(id))) return res.sendStatus(404);
    const result = await deletePostById(id)
    return result ? res.sendStatus(204) : res.sendStatus(500);
});

