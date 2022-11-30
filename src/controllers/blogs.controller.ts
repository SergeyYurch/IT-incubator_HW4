import {Router, Request, Response} from "express";
import {validatorMiddleware} from "../middlewares/validator.middleware";
import {blogsService} from "../services/blogs.service";
import {
    RequestWithBody,
    RequestWithId, RequestWithIdAndBody,
} from "../types/request.type";
import {BlogInputModelDto} from "./dto/blogInputModel.dto";
import {queryRepository} from "../repositories/queryRepository";
import {PaginatorOptionInterface} from "../repositories/queryRepository.interface";

export const blogsRouter = Router();

const {validateBlogInputModel, validateResult} = validatorMiddleware;
const {createNewBlog, editBlogById, deleteBlogById} = blogsService;
const {getAllBlogs, getBlogById, getPostsForBlog} = queryRepository;

const parseQueryPaginator = (req: Request): PaginatorOptionInterface => {
    return {
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : 'createdAt',
        sortDirection: req.query.sortDirection === 'desc' ? 'desc' : 'asc'
    };
};

blogsRouter.get('/', async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm ? String(req.query.searchNameTerm) : null;
    const paginatorOption: PaginatorOptionInterface = parseQueryPaginator(req);
    return res.status(200).json(await getAllBlogs(searchNameTerm, paginatorOption));
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


blogsRouter.get('/:id/posts', async (req: RequestWithId, res: Response) => {
    const id = req.params.id;
    const blogIsExist = await getBlogById(id);
    if (!blogIsExist) return res.sendStatus(404);
    const paginatorOption: PaginatorOptionInterface = parseQueryPaginator(req);
    const result = await getPostsForBlog(id, paginatorOption);
    return res.status(200).json(result);
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
        const result = await editBlogById(id, inputBlog);
        return !result ? res.sendStatus(500) : res.sendStatus(204);
    });

blogsRouter.delete('/:id', async (req: RequestWithId, res: Response) => {
    const id = req.params.id;
    const result = await deleteBlogById(id);
    return result ? res.sendStatus(204) : res.sendStatus(404);
});
