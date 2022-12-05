import {BlogEntity} from "../services/entities/blog.entity";
import {BlogDbInterface} from "./repository.interface";
import {blogsCollection} from "./db";
import {ObjectId} from "mongodb";
import {BlogEditEntity} from "../services/entities/blog-edit.entity";
import {BlogsRepositoryInterface} from "./blogs.repository.interface";

export const blogsRepository: BlogsRepositoryInterface = {

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
};