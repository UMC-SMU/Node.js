const {pool} = require("../../../config/database");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const authDao = require("./authDao");
const authProvider = require("./authProvider");
const userProvider = require("../User/userProvider");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");

exports.postSignIn = async function (email, pwd) {
    try {
        const emailRows = await userProvider.emailCheck(email);

        if (emailRows.length < 1) {
            return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
        }
        
        const hashedPassword = crypto
            .createHash("sha512")
            .update(pwd)
            .digest("hex");

        const passwordRows = await userProvider.passwordCheck(email);
        
        
        
        if (passwordRows[0].pwd != pwd) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        const userAccountRows = await userProvider.accountCheck(email);

        if (userAccountRows[0].status == "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userAccountRows[0].status == "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        let token = jwt.sign(
            // 토큰의 내용 (payload)
            {
                userIdx: userAccountRows[0].userIdx,
            },
            // 비밀키
            secret_config.jwtsecret, 
            // 유효기간 365일
            {
                expiresIn: "365d",
                subject: "User",
            }
        )

        return response(baseResponse.SUCCESS, { 'jwt': token });
    } catch (err) {
        console.log(`App - postSignIn Service error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    }
}