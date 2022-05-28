const {pool} = require("../../../config/database");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const postDao = require("./postDao");
const postProvider = require("./postProvider");

exports.createPost = async function(userIdx, content, postImgUrls) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();

        const insertPostParams = [userIdx, content];
        const postResult = await postDao.insertPost(connection, insertPostParams);
    
        const postIdx = postResult[0].insertId;

        for (postImgUrl of postImgUrls) {
            const insertPostImgParams = [postIdx, postImgUrl];
            const postImgResult = await postDao.insertPostImg(connection, insertPostImgParams);
        }
       

        await connection.commit();

        return response(baseResponse.SUCCESS, { addedPost: postIdx });
    } catch (err) {
        console.log(`App - createPost Service Error\n: ${err.message}`);

        await connection.rollback();
        
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }

} 

exports.editPost = async function (postIdx, content) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const editPostParams = [content, postIdx];
        const editPostResult = await postDao.updatePost(connection, editPostParams);

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - editPost Service error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

exports.editPostStatus = async function (postIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const postStatusResult = await postProvider.checkPostStatus(postIdx);
        if (postStatusResult == 'INACTIVE') {
            return errResponse(baseResponse.POST_STATUS_INACTIVE);
        }

        const editPostStatusResult = await postDao.updatePostStatus(connection, postIdx);

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - editPostStatus Service error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}
