import {MongoClient} from 'mongodb';
import {BlogEntity} from "../services/entities/blog.entity";
import {PostEntity} from "../services/entities/post.entity";
import * as dotenv from "dotenv";
import {UserEntity} from "../services/entities/user.entity";
dotenv.config();

const mongoUri = process.env.MONGO_URI
if (!mongoUri){
    throw new Error('!!!Mongo URI does not found')
}
const client = new MongoClient(mongoUri)
const db = client.db();
export const blogsCollection = db.collection<BlogEntity>('blogs')
export const postsCollection = db.collection<PostEntity>('posts')
export const usersCollection = db.collection<UserEntity>('users')

export async function runDB() {
    try{
        await client.connect();
        await client.db('guildDB').command({ping: 1})
        console.log("Mongo server connected successfully");
    } catch {
        console.log("Can't connect to DB");
        await client.close()
    }
}