import express from 'express';
import {testingRouter} from "./controllers/testing.controller";
import {blogsRouter} from "./controllers/blogs.controller";
import {postsRouter} from "./controllers/posts.controller";
import {authGuardMiddleware} from "./middlewares/authGuard.middleware";

export const app = express();
app.use(express.json())
app.use(authGuardMiddleware);
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)

