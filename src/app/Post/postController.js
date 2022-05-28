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

/*
    API No. 3.2
    API Name: 게시물 생성 API
    [POAT] /posts
*/
exports.postPosts = async function(req, res) {
    /*
        Body: userIdx, content, postImgUrls
    */
   const { userIdx, content, postImgUrls } = req.body;

   const userIdxFromJWT = req.verifiedToken.userIdx;

   if (userIdxFromJWT != userIdx) {
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    if (!userIdx) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } else if (postImgUrls.length <= 0) {
        return res.send(errResponse(baseResponse.POST_POSTIMGURLS_EMPTY));
    }

    if (userIdx <= 0) {
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    } else if (content.length > 450) {
        return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
    }

    const createPostResponse = await postService.createPost(
        userIdx,
        content,
        postImgUrls
    );
    
    return res.send(createPostResponse);
}

/*
    API No. 3.3
    API Name: 게시물 수정 API
    [PATCH] /posts/:postIdx
*/
exports.patchPost = async function(req, res) {
    /*
        Body: content
        Path Variable: postIdx
    */
    const postIdx = req.params.postIdx;
    const {content} = req.body;

    if (!postIdx) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
    } else if (!content) {
        return res.send(errResponse(baseResponse.POST_CONTENT_EMPTY));
    }

    if (postIdx <= 0) {
        return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
    } else if (content.length > 450) {
        return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
    }

    const editPostResponse = await postService.editPost(postIdx, content);

    return res.send(editPostResponse);
}

/*
    API No. 3.4
    API Name: 게시물 삭제 API
    [PATCH] /posts/:postIdx/status
*/
exports.PatchPostStatus = async function(req, res){
    /*
        Path Variable: postIdx
    */
   const postIdx = req.params.postIdx;
   
   if(!postIdx){
        return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
   }
   else if(postIdx <= 0){
        return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
   }

   const editPostStatusResponse = await postService.editPostStatus(postIdx);
   
   return res.send(editPostStatusResponse);
} 

