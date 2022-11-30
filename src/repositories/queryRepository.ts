import {blogsCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {PaginatorOptionInterface, QueryRepositoryInterface} from "./queryRepository.interface";
import {BlogsViewModelPaginatorDto, BlogViewModelDto} from "../controllers/dto/blogViewModel.dto";
import {PostsViewModelPaginatorDto, PostViewModelDto} from "../controllers/dto/postViewModel.dto";

const pagesCount = (totalCount: number, pageSize: number) => Math.ceil(totalCount / pageSize);

export const queryRepository: QueryRepositoryInterface = {

    getAllBlogs: async (
        searchNameTerm: string | null = null,
        paginatorOption: PaginatorOptionInterface
    ): Promise<BlogsViewModelPaginatorDto> => {
        console.log(`[queryRepository]: ${(new Date()).toISOString()} - start getAllBlogs`);
        const {sortBy, sortDirection, pageSize, pageNumber} = paginatorOption;
        const filter = searchNameTerm ? {'name': {$regex: searchNameTerm}} : {};
        const totalCount = await blogsCollection.count(filter);
        console.log(pageNumber);

        const result = await blogsCollection.find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
        const items: BlogViewModelDto[] = result.map(e => ({
                id: e._id.toString(),
                name: e.name,
                description: e.description,
                websiteUrl: e.websiteUrl,
                createdAt: e.createdAt
            })
        );
        return {
            pagesCount: pagesCount(totalCount, pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items
        };
    },

    getPostsForBlog: async (
        blogId: string,
        paginatorOption: PaginatorOptionInterface
    ): Promise<PostsViewModelPaginatorDto> => {
        console.log(`[queryRepository]: ${(new Date()).toISOString()} - start getPostsForBlog ${blogId}.`)

        const filter = {blogId: blogId};
        const {sortBy, sortDirection, pageSize, pageNumber} = paginatorOption;
        const totalCount = await postsCollection.count(filter);
        const result = await postsCollection.find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
        const items: PostViewModelDto[] = result.map(e => ({
                id: e._id.toString(),
                title: e.title,
                shortDescription: e.shortDescription,
                content: e.content,
                blogId: e.blogId,
                blogName: e.blogName,
                createdAt: e.createdAt
            })
        );
        return {
            pagesCount: pagesCount(totalCount, pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items
        };
    },

    getBlogById: async (id: string): Promise<BlogViewModelDto | null> => {
        console.log(`[queryRepository]: ${(new Date()).toISOString()} - start getBlogById`);
        const result = await blogsCollection.findOne({_id: new ObjectId(id)});
        if (!result) return null;
        const {name, websiteUrl, description, createdAt, _id} = result;
        return {
            id: _id.toString(),
            name,
            description,
            websiteUrl,
            createdAt
        };
    },

    getAllPosts: async (
        paginatorOption: PaginatorOptionInterface
    ): Promise<PostsViewModelPaginatorDto> => {
        console.log(`[queryRepository]: ${(new Date()).toISOString()} - start getAllPosts`);
        const {sortBy, sortDirection, pageSize, pageNumber} = paginatorOption;
        const totalCount = await postsCollection.count({});
        const result = await postsCollection.find({})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
        const items: PostViewModelDto[] = result.map(e => ({
                id: e._id.toString(),
                title: e.title,
                shortDescription: e.shortDescription,
                content: e.content,
                blogId: e.blogId,
                blogName: e.blogName,
                createdAt: e.createdAt
            })
        );
        return {
            pagesCount: pagesCount(totalCount, pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items
        };
    },


    getPostById: async (id: string): Promise<PostViewModelDto | null> => {
        console.log(`[queryRepository]: ${(new Date()).toISOString()} - start getPostById`);
        const result = await postsCollection.findOne({_id: new ObjectId(id)});
        if (!result) return null;
        const {title, shortDescription, content, blogId, blogName, createdAt, _id} = result;
        return {
            id: _id.toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt
        };
    }


};