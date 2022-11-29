import request from 'supertest';
import {app} from "../src/app";

const blog1 = {
    name: 'blog1',
    description:"description1",
    websiteUrl: 'https://youtube1.com'
};
const blog2 = {
    name: 'blog2',
    description:"description2",
    websiteUrl: 'https://youtube2.com'
};


describe('POST: /blogs create new blog', () => {

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    });

    // it('should return code 401 "Unauthorized" for unauthorized request', async () => {
    //     await request(app)
    //         .post('/blogs')
    //         .expect(401);
    // });





    it('should return code 201 and newBlog for correct input data', async () => {
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1)
            .expect(201);

        expect(newBlog1.body).toEqual({
            id: expect.any(String),
            name: 'blog1',
            websiteUrl: 'https://youtube1.com'
        });
    });

    it('should return code 400 and error with field name for blog without name ', async () => {
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                websiteUrl: 'https://youtube2.com'
            })
            .expect(400);

        expect(newBlog1.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'name'
            }]
        });
    });

    it('should return code 400 and error with field name for blog with long name ', async () => {
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                name: '123456789123456789',
                websiteUrl: 'https://youtube2.com'
            })
            .expect(400);

        expect(newBlog1.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'name'
            }]
        });
    });


    it('should return code 400 and error with field name for blog with empty___ name ', async () => {
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                name: '         ',
                description:"description1",
                websiteUrl: 'https://youtube2.com'
            })
            .expect(400);

        expect(newBlog1.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'name'
            }]
        });
    });


    it('should return code 400 and error with field websiteUrl for blog with incorrect websiteUrl ', async () => {
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                name: 'name',
                description:"description1",
                websiteUrl: 'youtube2.com'
            })
            .expect(400);

        expect(newBlog1.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'websiteUrl'
            }]
        });
    });

    it('should return code 400 and error with field description for blog without description ', async () => {
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                name: 'name',
                websiteUrl: 'youtube2.com'
            })
            .expect(400);

        expect(newBlog1.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'description'
            }]
        });
    });
});

describe('GET: /blogs get all blogs', () => {

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')

        //create new blog
        await request(app)
            .post('/blogs')
            // .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1);

        //create new blog
        await request(app)
            .post('/blogs')
            // .auth('admin', 'qwerty', {type: "basic"})
            .send(blog2);
    });


    it('should return code 200 and array with 2 elements', async () => {
        const blogs = await request(app)
            .get('/blogs')
            .expect(200);

        expect(blogs.body[0]).toEqual(
            {
                id: expect.any(String),
                name: 'blog1',
                description:"description1",
                websiteUrl: 'https://youtube1.com'
            });

        expect(blogs.body[1]).toEqual(
            {
                id: expect.any(String),
                name: 'blog2',
                description:"description2",
                websiteUrl: 'https://youtube2.com'
            });
    });
});


describe('GET:/blogs/id getBlogById', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    });

    it('should return code 404 for incorrect ID', async () => {
        await request(app)
            .get('/blogs/qwe-ss---s-s-s-srty')
            .expect(404);
    });

    it('should return code 200 and equal blog for correct request', async () => {
        const newBlog1 = await request(app)
            .post('/blogs')
            // .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1)
            .expect(201);
        const id = newBlog1.body.id;

        const blog = await request(app)
            .get(`/blogs/${id}`)
            .expect(200);

        expect(blog.body).toEqual({
            id: expect.any(String),
            name: 'blog1',
            description:"description1",
            websiteUrl: 'https://youtube1.com'
        });
    });
});

describe('DELETE:/blogs/id delete', () => {

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    });

    // it('should return code 401 "Unauthorized" for unauthorized request', async () => {
    //     await request(app)
    //         .delete('/blogs/1')
    //         .expect(401);
    // });

    it('should return code 404 for incorrect ID', async () => {
        await request(app)
            .delete('/blogs/qwerty')
            // .auth('admin', 'qwerty', {type: "basic"})
            .expect(404);
    });

    it('should return code 204 for correct request, and should return 404 for GET by id', async () => {
        const newBlog1 = await request(app)
            .post('/blogs')
            // .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1)
            .expect(201);
        const id = newBlog1.body.id;

        await request(app)
            .delete(`/blogs/${id}`)
            // .auth('admin', 'qwerty', {type: "basic"})
            .expect(204);

        await request(app)
            .get(`/blogs/${id}`)
            .expect(404);
    });
});

describe('PUT: /blogs edit blog', () => {
    let id = '';
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')

        const newBlog1 = await request(app)
            .post('/blogs')
            // .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1)
            .expect(201);
        id = newBlog1.body.id;
    });

    // it('should return code 401 "Unauthorized" for unauthorized request', async () => {
    //     await request(app)
    //         .put('/blogs')
    //         .expect(401);
    // });

    it('should return code 204 correct input data', async () => {
        await request(app)
            .put(`/blogs/${id}`)
            // .auth('admin', 'qwerty', {type: "basic"})
            .send({
                name: 'blog5',
                description: "description-edit",
                websiteUrl: 'https://youtube5.com'
            })
            .expect(204);

        const changedBlog = await request(app)
            .get(`/blogs/${id}`);

        expect(changedBlog.body).toEqual({
            id: expect.any(String),
            name: 'blog5',
            description: "description-edit",
            websiteUrl: 'https://youtube5.com'
        });
    });

    it('should return code 404 for incorrect ID', async () => {
        await request(app)
            .put(`/blogs/3333333333333`)
            // .auth('admin', 'qwerty', {type: "basic"})
            .send({
                name: 'blog5',
                description: "description-edit",
                websiteUrl: 'https://youtube5.com'
            })
            .expect(404);

        const changedBlog = await request(app)
            .get(`/blogs/${id}`);

        expect(changedBlog.body).toEqual({
            id: expect.any(String),
            name: 'blog5',
            description: "description-edit",
            websiteUrl: 'https://youtube5.com'
        });
    });


    it('should return code 400 for incorrect input data', async () => {
        await request(app)
            .put(`/blogs/${id}`)
            // .auth('admin', 'qwerty', {type: "basic"})
            .send({
                name: 'blog5',
                description: "description-edit",
                websiteUrl: 'youtube5.com'
            })
            .expect(400);

    });
});
