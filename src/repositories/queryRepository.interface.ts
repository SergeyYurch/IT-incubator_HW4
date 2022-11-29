import {PostEntity} from "../services/entities/post.entity";
import {BlogEntity} from "../services/entities/blog.entity";
import {ObjectId} from "mongodb";
import {BlogsViewModelPaginatorDto, BlogViewModelDto} from "../controllers/dto/blogViewModel.dto";
import {PostsViewModelPaginatorDto, PostViewModelDto} from "../controllers/dto/postViewModel.dto";

export interface PostDbInterface extends PostEntity {
    _id: ObjectId;
}

export interface BlogDbInterface extends BlogEntity {
    _id: ObjectId;
}

export interface PaginatorOptionInterface {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

export interface QueryRepositoryInterface {
    getAllBlogs: (
        searchNameTerm: string | null,
        paginatorOption:PaginatorOptionInterface
    ) => Promise<BlogsViewModelPaginatorDto>;
    getPostsForBlog: (
        blogId: string,
        paginatorOption:PaginatorOptionInterface
    ) => Promise<PostsViewModelPaginatorDto | null>;
    getBlogById: (id: string) => Promise<BlogViewModelDto | null>;
    getAllPosts: (
        paginatorOption:PaginatorOptionInterface
    ) => Promise<PostsViewModelPaginatorDto>;
    getPostById: (id: string) => Promise<PostViewModelDto | null>;
}