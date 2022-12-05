import {
    RepositoryInterface
} from "./repository.interface";
import {blogsCollection, postsCollection} from "./db";

export const repository: RepositoryInterface = {
    dataBaseClear: async (): Promise<boolean> => {
        console.log(`[repository]:start dataBaseClear`);
        const resultBlogs = await blogsCollection.deleteMany({});
        const resultPosts = await postsCollection.deleteMany({});
        return resultBlogs.acknowledged && resultPosts.acknowledged;
    }

};