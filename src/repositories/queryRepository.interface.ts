import {PostEntity} from "../services/entities/post.entity";
import {BlogEntity} from "../services/entities/blog.entity";
import {ObjectId} from "mongodb";
import {BlogViewModelDto} from "../controllers/dto/blogViewModel.dto";
import { PostViewModelDto} from "../controllers/dto/postViewModel.dto";
import {PaginatorDto} from "../controllers/dto/paginatorDto";
import {UserViewModelDto} from "../controllers/dto/userViewModel.dto";

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
        paginatorOption: PaginatorOptionInterface
    ) => Promise<PaginatorDto<BlogViewModelDto>>;
    getPostsForBlog: (
        blogId: string,
        paginatorOption: PaginatorOptionInterface
    ) => Promise<PaginatorDto<PostViewModelDto> | null>;
    getBlogById: (id: string) => Promise<BlogViewModelDto | null>;
    getAllPosts: (
        paginatorOption: PaginatorOptionInterface
    ) => Promise<PaginatorDto<PostViewModelDto>>;
    getPostById: (id: string) => Promise<PostViewModelDto | null>;
    getAllUsers: (
        paginatorOption: PaginatorOptionInterface,
        searchLoginTerm: string | null,
        searchEmailTerm: string | null
    ) => Promise<PaginatorDto<UserViewModelDto>>;
}