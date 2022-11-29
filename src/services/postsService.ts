import {PostViewModelDto} from "../controllers/dto/postViewModel.dto";
import {PostInputModelDto} from "../controllers/dto/postInputModel.dto";
import {repository} from "../repositories/repositoryMongo";
import {PostEntity} from "./entities/post.entity";
import {PostsServiceInterface} from "./posts.service.interface";
import {PostEditEntity} from "./entities/postEdit.entity";

const {
    getAllPosts,
    createNewPost,
    getPostById,
    updatePostById,
    deletePostById,
    getBlogById
} = repository;


export const postsService:PostsServiceInterface = {
    getAllPosts: async (): Promise<PostViewModelDto[]> => {
        const postsFromDb = await getAllPosts();
        return postsFromDb.map(p => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt
        }));

    },
    createNewPost: async (post: PostInputModelDto): Promise<PostViewModelDto | null> => {
        const {title, shortDescription, content, blogId} = post;
        const blogName = (await getBlogById(blogId))?.name
        if (!blogName) return null ;
        const createdAt = new Date().toISOString();
        const newPost: PostEntity = {
            title, shortDescription, content, blogId, blogName, createdAt
        };
        const postInDb = await createNewPost(newPost);
        if(!postInDb) return null
        return {
            id: postInDb._id.toString(),
            title: postInDb.title,
            shortDescription: postInDb.shortDescription,
            content: postInDb.content,
            blogId: postInDb.blogId,
            blogName: postInDb.blogName,
            createdAt:postInDb.createdAt
        };
    },
    getPostById: async (id: string): Promise<PostViewModelDto | null> => {
        const postFromDb = await getPostById(id);
        if (!postFromDb) return null;
        const {title, shortDescription, content, blogId, blogName, createdAt,_id} = postFromDb;
        if (!blogName) return null;
        return {
            id:_id.toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt
        };
    },

    editPostById: async (id: string, post: PostInputModelDto): Promise<boolean> => {
        const {title, shortDescription, content, blogId} = post;
        const blogName =(await getBlogById(blogId))?.name
        if (!blogName) return false;
        const postToDb: PostEditEntity = {
            title,
            blogId,
            content,
            shortDescription,
            blogName
        };
        return await updatePostById(id, postToDb);
    },

    deletePostById: async (id: string): Promise<boolean> => {
        return deletePostById(id);
    },
};