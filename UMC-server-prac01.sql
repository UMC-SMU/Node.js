-- 팔로잉하고 있는 유저 게시물
SELECT p.postIdx, p.content, f.followeeIdx
FROM Post as p
    join User as u on u.status = 'ACTIVE'
    join Follow as f on f.followeeIdx = u.userIdx
WHERE p.postIdx = f.followeeIdx and u.userIdx = ?
group by f.followeeIdx;

-- 게시물 좋아요 개수
SELECT p.postIdx,
    IF(postLIkes is null, 0, postLikes) as postLikes
FROM Post as p
         left join(SELECT postIdx, userIdx, COUNT(postLikesIdx) as postLikes
         FROM PostLikes
         WHERE status = 'ACTIVE'
         group by postIdx) l on l.userIdx = p.userIdx
WHERE p.postIdx = ?;

-- 게시물 올린 시간 조회
SELECT u.userIdx, p.postIdx, (
    CASE
        WHEN TIMESTAMPDIFF(SECOND, p.updatedAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(SECOND, p.updatedAt, NOW()), '초전')
        WHEN TIMESTAMPDIFF(MINUTE, p.updatedAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.updatedAt, NOW()), '분전')
        WHEN TIMESTAMPDIFF(HOUR, p.updatedAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.updatedAt, NOW()), '시간 전')
        WHEN TIMESTAMPDIFF(DAY, p.updatedAt, NOW()) < 7 THEN CONCAT(TIMESTAMPDIFF(DAY, p.updatedAt, NOW()), '일 전')
        ELSE CONCAT(TIMESTAMPDIFF(YEAR, p.updatedAt, NOW()), '년 전')
    END
    ) as time
FROM Post as p
    join User as u on p.userIdx = u.userIdx
WHERE p.status = 'ACTIVE' and p.postIdx = ?;




