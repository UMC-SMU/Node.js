-- 유저 화면에 나오는 데이터
SELECT name, nickName, profilelmgUrl, website, introduce -- 인스타 유저 화면에 나오는 데이터
FROM User
WHERE userIdx = 2; -- 조건

-- 게시물과 관련된 데이터
SELECT *
FROM Post
WHERE status = 'ACTIVE' and userIdx = 2; -- 특정 유저 게시물과 활성화된 게시물만 조회할 수 있도록하는 조건

/* 개수를 제공해주는 함수 COUNT 사용
   2번 유저가 쓴 개시물의 개수 뽑아내기(postIdx 개수)
 */
SELECT COUNT(postIdx)
FROM Post
WHERE  status = 'ACTIVE' and userIdx  = 2;

/* 두개 쿼리 합치기(join)
   테이블끼리 join
   join에서 조건은 on으로 처리
 */
SELECT name, nickName, profilelmgUrl, website, introduce, postIdx -- 인스타 유저 화면에 나오는 데이터
FROM User
    join Post on Post.userIdx = User.userIdx and Post.status = 'ACTIVE'
WHERE User.userIdx = 2;

/* 두개 쿼리 합치기(join)
    쿼리 join (게시물 개수 가져오는 쿼리 join)
   join(서브쿼리) <서브쿼리 이름> on 조건 (서브쿼리의 결과에 대한 조건)
   join에서 조건은 on으로 처리

   서브쿼리 수정 -> 유저를 기준으로 그 게시물의 개수가 나오도록 -> userIdx를 기준으로 group화
   group by 사용 -> group화
 */

 /*케이스에 따라서 결과를 다르게 하고 싶다 IF, CASE 사용
   CASE는 조건이 여러개인 경우, IF는 조건이 하나인 경우
  */

-- 데이터가 없을 때 left join은 null처리, join은 null 처리 안함

-- 인스타 유저 화면에 나오는 데이터
SELECT name, nickName, profilelmgUrl, website, introduce,
    IF(postCount is null, 0, postCount) as postCount,
    IF(followerCount is null, 0, followerCount) as followCount,
    IF(followingCount is null, 0, followingCount) as followingCount

FROM User
-- 게시물 개수
    left join(SELECT userIdx, COUNT(postIdx) as postCount -- COUNT(postIdx)에 이름 부여
    FROM Post
    WHERE  status = 'ACTIVE'
    group by userIdx) p on p.userIdx = User.userIdx
-- 팔로워 개수
    left join(SELECT followIdx, COUNT(followerIdx) as followerCount
    FROM Follow
    WHERE status = 'ACTIVE'
    group by followerIdx) f1 on f1.followIdx = User.userIdx
-- 팔로잉 개수
    left join (SELECT followeeIdx, COUNT(followIdx) as followingCount
    FROM Follow
    WHERE status = 'ACTIVE'
    group by followeeIdx) f2 on f2.followeeIdx = User.userIdx


WHERE User.userIdx = 3;

-- userIdx 별로 게시물의 개수가 나옴
SELECT userIdx, COUNT(postIdx) as postCount -- COUNT(postIdx)에 이름 부여
    FROM Post
    WHERE  status = 'ACTIVE'
group by userIdx;

-- 피드에서 보이는 게시물을 조회하는 쿼리
-- 유저가 작성한 게시물의 idx를 가져오는 쿼리
-- 게시물 사진 가져오기 위해서 게시물 사진 테이블 join
-- userIdx에 2를 입력 -> 2 번 유저가 작성한 게시물의 인덱스와 2번 게시물의 사진url이 나온다.
SELECT p.postIdx,
    pi.imgUrl as postImgUrl
FROM Post as p
    join User as u on u.userIdx = p.userIdx
    join PostImgUrl as pi on pi.postIdx = p.postIdx and pi.status = 'ACTIVE'
WHERE p.status = 'ACTIVE' and u.userIdx = ?
group by p.postIdx -- 첫번째 게시물만 보여주고 있으므로 postIdx로 그룹화

/* 가장 최근의 게시물을 먼저 보여주므로 주는 구조
    -> order by로 결과 게시물을 올린 기준으로 정렬(createdAt)
    desc: 내림차순, asc: 오름차순 */
order by p.createdAt desc;
