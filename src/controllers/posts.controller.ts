import {Router, Request, Response} from "express";
import {validatorMiddleware} from "../middlewares/validator.middleware";
import {postsService} from "../services/posts.service";
import {PostInputModelDto} from "./dto/postInputModel.dto";
import {
    RequestWithBody, RequestWithId,
    RequestWithIdAndBody
} from "../types/request.type";
import {queryRepository} from "../repositories/query.repository";
import {PaginatorOptionInterface} from "../repositories/interfaces/query.repository.interface";
import {parseQueryPaginator} from "../helpers/helpers";
import {authBasicMiddleware} from "../middlewares/authBasic.middleware";
import {authBearerMiddleware} from "../middlewares/authBearer.middleware";
import {CommentInputModelDto} from "./dto/commentInputModel.dto";
import {CommentViewModelDto} from "./dto/commentViewModel.dto";

export const postsRouter = Router();
const {
    validatePostInputModel,
    validateResult,
    validateBlogId,
    validateCommentInputModel
} = validatorMiddleware;
const {deletePostById, editPostById, createNewPost} = postsService;
const {getPostById, getAllPosts} = queryRepository;

postsRouter.get('/', async (req: Request, res: Response) => {
    const paginatorOption: PaginatorOptionInterface = parseQueryPaginator(req);
    const posts = await getAllPosts(paginatorOption);
    return res.status(200).json(posts);
});

postsRouter.post(
    '/',
    authBasicMiddleware,
    validatePostInputModel(),
    validateBlogId(),
    validateResult,
    async (req: RequestWithBody<PostInputModelDto>, res: Response
    ) => {
        const {title, shortDescription, content, blogId} = req.body;
        const createdPost = await createNewPost({title, shortDescription, content, blogId});
        return createdPost ? res.status(201).json(createdPost) : res.sendStatus(500);
    });

postsRouter.get('/:id', async (req: RequestWithId, res: Response) => {
    const id = req.params.id;
    const result = await getPostById(id);
    return result ? res.status(200).json(result) : res.sendStatus(404);
});

postsRouter.put(
    '/:id',
    authBasicMiddleware,
    validatePostInputModel(),
    validateBlogId(),
    validateResult,
    async (req: RequestWithIdAndBody<PostInputModelDto>, res: Response
    ) => {
        const id = req.params.id;
        if (!(await getPostById(id))) return res.sendStatus(404);
        const body = req.body;
        const post: PostInputModelDto = {
            title: body.title,
            blogId: body.blogId,
            content: body.content,
            shortDescription: body.shortDescription
        };
        const result = await editPostById(id, post);
        return result ? res.sendStatus(204) : res.sendStatus(404);
    });

postsRouter.delete('/:id',
    authBasicMiddleware,
    async (req: RequestWithId, res: Response) => {
        const id = req.params.id;
        if (!(await getPostById(id))) return res.sendStatus(404);
        const result = await deletePostById(id);
        return result ? res.sendStatus(204) : res.sendStatus(500);
    });


postsRouter.post(
    '/:postId/comments',
    authBearerMiddleware,
    validateCommentInputModel(),
    validateResult,
    async (req: RequestWithIdAndBody<CommentInputModelDto>, res: Response
    ) => {
        const postId = req.params.postId;
        const userId = req.user!.id;
        if (!(await getPostById(postId))) return res.sendStatus(404);
        const {content} = req.body;
        const createdComment: CommentViewModelDto = await createNewComment(content, userId);
        return createdComment ? res.status(201).json(createdComment) : res.sendStatus(500);
    });


postsRouter.get('/:postId/comments',
    authBearerMiddleware,
    async (req: RequestWithIdAndBody<CommentInputModelDto>, res: Response) => {
        const postId = req.params.postId;
        if (!(await getPostById(postId))) return res.sendStatus(404);
        const userId = req.user!.id;
        const paginatorOption: PaginatorOptionInterface = parseQueryPaginator(req);
        const result = await getUserComments(userId);
        return result ? res.status(200).json(result) : res.sendStatus(500);
    });