import {PostEntity} from "../services/entities/post.entity";
import {BlogEntity} from "../services/entities/blog.entity";
import {ObjectId} from "mongodb";
import {PostEditEntity} from "../services/entities/postEdit.entity";
import {BlogEditEntity} from "../services/entities/blog-edit.entity";

export interface PostDbInterface extends PostEntity {
    _id: ObjectId;
}

export interface BlogDbInterface extends BlogEntity {
    _id: ObjectId;
}

export interface RepositoryInterface {
    dataBaseClear: () => Promise<boolean>;
    getAllBlogs: () => Promise<BlogDbInterface[]>;
    createNewBlog: (inputBlog: BlogEntity) => Promise<BlogDbInterface | null>;
    getBlogById: (id: string) => Promise<BlogDbInterface | null>;
    updateBlogById: (id: string, inputBlog: BlogEditEntity) => Promise<boolean>;
    deleteBlogById: (id: string) => Promise<boolean>;
    getAllPosts: () => Promise<PostDbInterface[]>;
    createNewPost: (inputPost: PostEntity) => Promise<PostDbInterface|null>;
    getPostById: (id: string) => Promise<PostDbInterface | null>;
    updatePostById: (id: string, inputPost: PostEditEntity) => Promise<boolean>;
    deletePostById: (id: string) => Promise<boolean>;
}