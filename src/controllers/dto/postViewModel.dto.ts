export interface PostViewModelDto {
    id:string;
    title:string;
    shortDescription:string;
    content: string;
    blogId:string;
    blogName:string;
    createdAt:string;
}

export interface PostsViewModelPaginatorDto {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostViewModelDto[];

}