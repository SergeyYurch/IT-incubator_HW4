import {PostEntity} from "../services/entities/post.entity";
import {BlogEntity} from "../services/entities/blog.entity";
import {
    BlogDbInterface,
    PostDbInterface,
    RepositoryInterface
} from "./repository.interface";
import {blogsCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {BlogEditEntity} from "../services/entities/blog-edit.entity";
import {PostEditEntity} from "../services/entities/postEdit.entity";

export const repository:RepositoryInterface = {
    dataBaseClear: async (): Promise<boolean> => {
        const resultBlogs = await blogsCollection.deleteMany({});
        const resultPosts = await postsCollection.deleteMany({});
        return resultBlogs.acknowledged && resultPosts.acknowledged;
    },

    getAllBlogs: async (): Promise<BlogDbInterface[]> => {
        return blogsCollection.find({}).toArray();
    },

    createNewBlog: async (inputBlog: BlogEntity): Promise<BlogDbInterface | null> => {
        const result = await blogsCollection.insertOne(inputBlog);
        return await blogsCollection.findOne({_id: result.insertedId});
    },

    getBlogById: async (id: string): Promise<BlogDbInterface | null> => {
        return await blogsCollection.findOne({_id: new ObjectId(id)});
    },

    updateBlogById: async (id: string, inputBlog: BlogEditEntity): Promise<boolean> => {
        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: inputBlog});
        return result.acknowledged;
    },

    deleteBlogById: async (id: string): Promise<boolean> => {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return result.acknowledged;
    },

    getAllPosts: (): Promise<PostDbInterface[]> => {
        return postsCollection.find({}).toArray();
    },

    createNewPost: async (inputPost: PostEntity): Promise<PostDbInterface | null> => {
        const result = await postsCollection.insertOne(inputPost);
        return await postsCollection.findOne({_id: result.insertedId});
    },

    getPostById: async (id: string): Promise<PostDbInterface | null> => {
        return await postsCollection.findOne({_id: new ObjectId(id)});
    },

    updatePostById: async (id: string, inputPost: PostEditEntity):Promise<boolean> => {
        const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: inputPost});
        return result.acknowledged;
    },

    deletePostById: async (id: string): Promise<boolean> => {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.acknowledged;
    }
};