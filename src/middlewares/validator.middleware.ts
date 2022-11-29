import {Request, Response, NextFunction} from "express";

import {body, validationResult} from 'express-validator';
import {blogsService} from "../services/blogs.service";
import {APIErrorResultModel} from "../controllers/dto/apiErrorResult.dto";

export const validatorMiddleware = {
    validateBlogInputModel: () => [
        body('name')
            .trim()
            .isLength({min: 1, max: 15})
            .withMessage('name must be at max 10 chars long')
            .exists()
            .withMessage('name is required'),
        body('description')
            .trim()
            .exists()
            .withMessage('name is required')
            .isLength({min: 1, max: 500})
            .withMessage('length is wrong'),
        body('websiteUrl')
            .exists()
            .trim()
            .isLength({max: 100})
            .withMessage('websiteUrl must be at max 100 chars long')
            .matches(/^https:\/\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
            .exists()
            .withMessage('name is required')
    ],
    validatePostInputModel: () => [
        body('title')
            .exists()
            .trim()
            .withMessage('title is required')
            .isLength({min: 1, max: 30})
            .withMessage('title must be at max 30 chars long'),
        body('shortDescription')
            .exists()
            .trim()
            .withMessage('shortDescription is required')
            .isLength({min: 1, max: 100})
            .withMessage('shortDescription must be at max 100 chars long'),
        body('content')
            .exists()
            .trim()
            .isLength({min: 1, max: 1000})
            .withMessage('content must be at max 1000 chars long'),
        body('blogId')
            .trim()
            .custom(
                async (blogId) => {
                    const blog = await blogsService.getBlogById(blogId);
                    if (!blog) throw new Error();
                }
            )
            .exists()
            .withMessage('blogId is required')
    ],
    validateResult: (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        const errorMessages: APIErrorResultModel = {
            errorsMessages: result.array({onlyFirstError: true}).map(e => ({
                message: e.msg,
                field: e.param
            }))
        };
        if (!result.isEmpty()) return res.status(400).json(errorMessages);
        return next();
    }
};