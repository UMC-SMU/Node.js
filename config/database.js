const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'yeon0209.cv8zchdtjdcd.ap-northeast-2.rds.amazonaws.com',
    user: 'jykimv',
    port: '3306',
    password: 'kjy020209',
    database: 'UdemyServer'
});

module.exports = {
    pool: pool
};