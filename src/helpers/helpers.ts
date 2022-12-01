import {Request} from "express";
import {PaginatorOptionInterface} from "../repositories/queryRepository.interface";

export const parseQueryPaginator = (req: Request): PaginatorOptionInterface => {
    return {
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    };
};