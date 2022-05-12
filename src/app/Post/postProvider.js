const { pool } = require("../../../config/database");
const postDao = require("./postDao");

exports.retrieveUserPosts = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userPostResult = await postDao.selectUserPosts(connection, userIdx);

    connection.release();

    return userPostResult;
}

exports.retrievePostLists = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const postListResult = await postDao.selectPosts(connection, userIdx);

    for (post of postListResult){
        const postIdx = post.postIdx;
        const postImgResult = await postDao.selectPostImgs(connection, postIdx);
        post.imgs = postImgResult;
    }   

    connection.release();
    return postListResult;
}