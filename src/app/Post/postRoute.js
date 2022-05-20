module.exports = function(app){
    const post = require('./postController');

    //3.1 게시물 리스트 조회 API
    app.get('/posts', post.getPosts)

    //3.2 게시물 생성 API
    app.post('/posts', post.postPosts)

    // 3.3 게시물 수정 API
    app.patch('/posts/:postIdx', post.patchPost);

    // 3.4 게시물 삭제 API
    app.patch('/posts/:postIdx/status', post.PatchPostStatus);
}