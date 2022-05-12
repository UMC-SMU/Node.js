// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userInfo 조회
async function selectUserInfo(connection, userIdx) {
  const selectUserInfoQuery = `
        SELECT u.nickName as nickName,
            u.name as name,
            u.profilelmgUrl as profileImgUrl,
            u.website as website,
            u.introduce as introduction,
            IF(followerCount is null, 0, followerCount) as followerCount,
            If(followingCount is null, 0, followingCount) as followingCount,
            If(postCount is null, 0, postCount) as postCount
        FROM User as u
            left join (select userIdx, count(postIdx) as postCount from Post WHERE status = 'ACTIVE' group by postIdx) p on p.userIdx = u.userIdx
            left join (select followerIdx, count(followIdx) as followerCount from Follow WHERE status = 'ACTIVE' group by followIdx) fc on fc.followerIdx = u.userIdx
            left join (select followeeIdx, count(followIdx) as followingCount from Follow WHERE status = 'ACTIVE' group by followIdx) f on f.followeeIdx = u.userIdx
        WHERE u.userIdx = ? and u.status = 'ACTIVE'
        group by u.userIdx;
                 `;
  const [userInfoRow] = await connection.query(selectUserInfoQuery, userIdx);

  return userInfoRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, password, nickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}


module.exports = {
  selectUser,
  selectUserEmail,
  selectUserInfo,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
};
