import request from 'supertest';
import {app} from "../src/app";

const blog1 = {
    name: 'blog1',
    websiteUrl: 'https://youtube1.com'
}

describe('POST: /posts create new post', () => {
    let blogId = '';
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
        //create blog
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1);
        blogId = newBlog1.body.id;
    });

    it('should return code 401 "Unauthorized" for unauthorized request', async () => {
        await request(app)
            .post('/posts')
            .expect(401);
    });

    it('should return code 201 and newBlog for correct input data', async () => {

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: 'post1',
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: blogId
            })
            .expect(201);

        expect(newPost.body).toEqual({
            id: expect.any(String),
            title: 'post1',
            shortDescription: 'shortDescription1',
            content: 'content1',
            blogId: blogId,
            blogName: 'blog1'
        });
    });

    it('should return code 400 and error with field title for blog without title ', async () => {

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: blogId
            })
            .expect(400);

        expect(newPost.body).toEqual({
            errorsMessages: [{
                field: 'title',
                message: expect.any(String)
            }]
        });
    });

    it('should return code 400 and error with relevant field for incorrect title ', async () => {

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: "1234567891123456789112345678912",
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: blogId
            })
            .expect(400);

        expect(newPost.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'title'
            }]
        });
    });


    it('should return code 400 and error with relevant field for blog without shortDescription ', async () => {

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: 'title',
                shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                    ' Donec libero odio, feugiat eu aliquet a, porta quis lectus. Maecenas et' +
                    ' turpis quis neque faucibus ultricies. Aliquam condimentum suscipit erat,' +
                    ' eget efficitur ex cursus nec. Maecenas a dignissim odio. Vivamus at arcu' +
                    ' aliquet, fringilla nulla ut, ornare neque. Mauris a metus ut orci' +
                    ' facilisis iaculis sed ac ex. Donec vel massa eget orci varius venenatis. ' +
                    'Sed consectetur sodales ex tincidunt porttitor. Sed porta blandit dui sed' +
                    ' lobortis.  Quisque semper tortor at urna pellentesque fringilla sit amet' +
                    '  sed sapien. Etiam at eros id tellus placerat iaculis ut et metus. Mauris' +
                    ' semper  massa nunc. Vestibulum condimentum massa ac neque euismod, a' +
                    ' viverra  tortor bibendum. Praesent ultricies ut libero sit amet pretium. Orci varius.',
                content: 'content1',
                blogId: blogId
            })
            .expect(400);

        expect(newPost.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'shortDescription'
            }]
        });
    });
    it('should return code 400 and error with field content for blog without content ', async () => {

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: 'title1',
                shortDescription: 'shortDescription1',
                blogId: blogId
            })
            .expect(400);

        expect(newPost.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'content'
            }]
        });
    });


    it('should return code 400 and error with field blogId for blog without blogId ', async () => {

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: 'title1',
                shortDescription: 'shortDescription1',
                content: 'content1'
            })
            .expect(400);

        expect(newPost.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'blogId'
            }]
        });
    });


    it('should return code 400 and error with relevant field for incorrect blogId ', async () => {

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: "title1",
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: 'blogId'
            })
            .expect(400);

        expect(newPost.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: 'blogId'
            }]
        });
    });
});


describe('GET: /posts get all posts', () => {

    let blogId = '';
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')

        //create blog
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1);
        blogId = newBlog1.body.id;
    });

    it('should return code 200 and array with 2 elements', async () => {

        //create  newPost1
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: "title1",
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: blogId
            });

        //create newPost2
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: "title2",
                shortDescription: 'shortDescription2',
                content: 'content2',
                blogId: blogId
            });

        const posts = await request(app)
            .get('/posts')
            .expect(200);

        expect(posts.body[0]).toEqual(
            {
                id: expect.any(String),
                title: 'title1',
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: blogId,
                blogName: 'blog1'
            });

        expect(posts.body[1]).toEqual(
            {
                id: expect.any(String),
                title: 'title2',
                shortDescription: 'shortDescription2',
                content: 'content2',
                blogId: blogId,
                blogName: 'blog1'
            });
    });
});


describe('GET:/posts/id get post by ID', () => {
    let id = '';
    let blogId = '';
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
        //create blog
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1);
        blogId = newBlog1.body.id;
        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: 'post1',
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: blogId
            });
        id = newPost.body.id;

    });

    it('should return code 404 for incorrect ID', async () => {
        await request(app)
            .get('/posts/qwerty')
            .expect(404);
    });

    it('should return code 200 and equal post for correct request', async () => {
        const post = await request(app)
            .get(`/posts/${id}`)
            .expect(200);

        expect(post.body).toEqual({
            id: expect.any(String),
            title: 'post1',
            shortDescription: 'shortDescription1',
            content: 'content1',
            blogId: blogId,
            blogName: 'blog1'
        });
    });
});


describe('PUT:/posts/id edit post by ID', () => {
    let id = '';
    let blogId = '';
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
        //create blog
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1);
        blogId = newBlog1.body.id;
        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: 'post1',
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: blogId
            });
        id = newPost.body.id;

    });

    it('should return code 401 "Unauthorized" for unauthorized request', async () => {

        await request(app)
            .put(`/posts/${id}`)
            .send({
                title: 'title1',
                content: 'content1',
                shortDescription: 'shortDescription1',
                blogId: 'blogId'
            })
            .expect(401);
    });


    it('should return code 404 for incorrect ID', async () => {
        await request(app)
            .put('/posts/qwerty')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: 'title1',
                content: 'content1',
                shortDescription: 'shortDescription1',
                blogId: blogId
            })
            .expect(404);
    });


    it('should return code 204 and equal post for correct request', async () => {

        await request(app)
            .put(`/posts/${id}`)
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: 'title3',
                content: 'content3',
                shortDescription: 'shortDescription3',
                blogId: blogId
            })
            .expect(204);
    });

});


describe('DELETE:/posts/id delete', () => {
    let id = '';
    let blogId = '';
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')

        //create blog
        const newBlog1 = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(blog1);
        blogId = newBlog1.body.id;
        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                title: 'post1',
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: blogId
            });
        id = newPost.body.id;


    });

    it('should return code 401 "Unauthorized" for unauthorized request', async () => {
        await request(app)
            .delete('/posts/1')
            .expect(401);
    });


    it('should return code 404 for incorrect ID', async () => {
        await request(app)
            .delete('/posts/qwerty')
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(404);
    });

    it('should return code 204 for correct request, and should return 404 for GET by id', async () => {
        await request(app)
            .delete(`/posts/${id}`)
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(204);

        await request(app)
            .get(`/posts/${id}`)
            .expect(404);
    });


});