import {Router, Request, Response} from "express";
import {validatorMiddleware} from "../middlewares/validator.middleware";
import {blogsService} from "../services/blogs.service";
import {
    RequestWithBody,
    RequestWithId, RequestWithIdAndBody,
} from "../types/request.type";
import {BlogInputModelDto} from "./dto/blogInputModel.dto";

export const blogsRouter = Router();

const {validateBlogInputModel, validateResult} = validatorMiddleware;
const {getAllBlogs, createNewBlog, editBlogById, getBlogById, deleteBlogById} = blogsService;

blogsRouter.get('/', async (req: Request, res: Response) => {
    return res.status(200).json(await getAllBlogs());
});

blogsRouter.post('/',
    validateBlogInputModel(),
    validateResult,
    async (req: RequestWithBody<BlogInputModelDto>, res: Response) => {
        const {name, websiteUrl, description} = req.body;
        const result = await createNewBlog({name, websiteUrl, description});
        return result ? res.status(201).json(result) : res.sendStatus(500);
    });

blogsRouter.get('/:id', async (req: RequestWithId, res: Response) => {
    const id = req.params.id;
    const result = await getBlogById(id);
    return result ? res.status(200).json(result) : res.sendStatus(404);
});

blogsRouter.put('/:id',
    validateBlogInputModel(),
    validateResult,
    async (req: RequestWithIdAndBody<BlogInputModelDto>, res: Response) => {
        const id = req.params.id;
        const blog = await getBlogById(id);
        if (!blog) return res.sendStatus(404);
        const {name, websiteUrl, description} = req.body;
        const inputBlog: BlogInputModelDto = {name, websiteUrl, description};
        const result =await editBlogById(id, inputBlog);
        return !result ? res.sendStatus(500) : res.sendStatus(204);
    });

blogsRouter.delete('/:id', async (req: RequestWithId, res: Response) => {
    const id = req.params.id;
    const result =await deleteBlogById(id);
    return  result? res.sendStatus(204) : res.sendStatus(404);
});
