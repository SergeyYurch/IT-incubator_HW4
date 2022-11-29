export interface BlogsViewModelPaginatorDto {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogViewModelDto[];

}

export interface BlogViewModelDto {
    id: string;
    name:string;
    description:string;
    websiteUrl:string;
    createdAt:string;
}