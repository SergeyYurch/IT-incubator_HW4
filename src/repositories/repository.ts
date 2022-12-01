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
        console.log(`[repository]:start dataBaseClear`);
        const resultBlogs = await blogsCollection.deleteMany({});
        const resultPosts = await postsCollection.deleteMany({});
        return resultBlogs.acknowledged && resultPosts.acknowledged;
    },

    createNewBlog: async (inputBlog: BlogEntity): Promise<BlogDbInterface | null> => {
        console.log(`[repository]:start createNewBlog`);
        const result = await blogsCollection.insertOne(inputBlog);
        return await blogsCollection.findOne({_id: result.insertedId});
    },

    updateBlogById: async (id: string, inputBlog: BlogEditEntity): Promise<boolean> => {
        console.log(`[repository]:start updateBlogById`);
        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: inputBlog});
        return result.acknowledged;
    },

    deleteBlogById: async (id: string): Promise<boolean> => {
        console.log(`[repository]:start deleteBlogById`);
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return result.acknowledged;
    },

    createNewPost: async (inputPost: PostEntity): Promise<PostDbInterface | null> => {
        console.log(`[repository]:start createNewPost`);
        const result = await postsCollection.insertOne(inputPost);
        return await postsCollection.findOne({_id: result.insertedId});
    },

    updatePostById: async (id: string, inputPost: PostEditEntity):Promise<boolean> => {
        console.log(`[repository]:start updatePostById`);
        const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: inputPost});
        return result.acknowledged;
    },

    deletePostById: async (id: string): Promise<boolean> => {
        console.log(`[repository]:start deletePostById`);
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.acknowledged;
    }
};