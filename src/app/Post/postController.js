const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const postService = require("./postService");
const postProvider = require("./postProvider");

/*
    API No. 3.1
    API Name: 게시물 조회 API
    [Get] /post?userIdx=
*/
exports.getPosts = async function(req, res) {
    /*
        Query String: userIdx
    */
    const userIdx = req.query.userIdx;

    //validation
    if(!userIdx) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }
    if (userIdx <= 0) {
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }

    const postListResult = await postProvider.retrievePostLists(userIdx);

    return res.send(response(baseResponse.SUCCESS, postListResult));
}