import {repository} from "../repositories/repositoryMongo";
import {BlogViewModelDto} from "../controllers/dto/blogViewModel.dto";
import {BlogsServiceInterface} from "./blogs.service.interface";
import {BlogInputModelDto} from "../controllers/dto/blogInputModel.dto";
import {BlogEntity} from "./entities/blog.entity";
import {BlogEditEntity} from "./entities/blog-edit.entity";

const {
    getAllBlogs,
    createNewBlog,
    updateBlogById,
    getBlogById,
    deleteBlogById
} = repository;

export const blogsService:BlogsServiceInterface = {

    getAllBlogs: async (): Promise<BlogViewModelDto[]> => {
        const blogsFromDb = await getAllBlogs();
        return blogsFromDb.map(p => ({
            id: p._id.toString(),
            name: p.name,
            websiteUrl: p.websiteUrl,
            description: p.description,
            createdAt: p.createdAt
        }));
    },

    createNewBlog: async (blog: BlogInputModelDto): Promise<BlogViewModelDto | null> => {
        const {name, websiteUrl, description} = blog;
        const createdAt = new Date().toISOString();
        const newBlog: BlogEntity = {
            name, websiteUrl, description, createdAt
        };
        const blogInDb = await createNewBlog(newBlog);
        if (!blogInDb) return null;
        return {
            id: blogInDb._id.toString(),
            name: blogInDb.name,
            description: blogInDb.description,
            websiteUrl: blogInDb.websiteUrl,
            createdAt: blogInDb.createdAt
        };
    },

    getBlogById: async (id: string): Promise<BlogViewModelDto | null> => {
        const blogFromDb = await getBlogById(id);
        if (!blogFromDb) return null;
        const {name, websiteUrl,description, createdAt, _id} = blogFromDb;
        return {
            id: _id.toString(),
            name,
            description,
            websiteUrl,
            createdAt
        };
    },

    editBlogById: async (id: string, blog: BlogInputModelDto): Promise<boolean> => {
        const {name, websiteUrl, description} = blog;
       // const oldBlog = await getBlogById(id);
       // if (!oldBlog) return false;
        const blogToDb: BlogEditEntity = {
            name,
            websiteUrl,
            description,
        };
        return await updateBlogById(id, blogToDb);
    },

    deleteBlogById: async (id: string): Promise<boolean> => {
        const blog = await getBlogById(id);
        if (!blog) return false;
        return await deleteBlogById(id);
    },
};