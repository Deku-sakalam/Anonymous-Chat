"use server";
import { neon } from "@neondatabase/serverless";
import { Post } from "./db";
const sql = neon(process.env.DATABASE_URL!);

export async function insertPost(
  content: string,
  handle: string,
  deviceId: string
) {
  const newPost: Post = {
    deviceid: deviceId,
    id: crypto.randomUUID(),
    content: content,
    date: new Date(),
    like: [],
    dislike: [],
    comments: [],
    handle: handle,
  };
  await sql`
    INSERT INTO posts (deviceId, id, content, date, "like", dislike, comments,handle)
    VALUES (${newPost.deviceid},${newPost.id},${newPost.content},${
    newPost.date
  },${JSON.stringify(newPost.like)},${JSON.stringify(
    newPost.dislike
  )},${JSON.stringify(newPost.comments)},${newPost.handle});
  `;

  const result = await sql`
    SELECT * 
    FROM posts 
    WHERE id = ${newPost.id};
  `;
  return result;
}

export async function getAll(handle: string) {
  const result =
    await sql`SELECT * FROM posts where handle = ${handle} order by date desc`;
  return result as Post[];
}

export async function updateLike(id: string, deviceId: string) {
  //like
  const existingLikes = await sql`SELECT "like" FROM posts WHERE id = ${id}`;
  const like = existingLikes[0].like;
  const lIndex = like.indexOf(deviceId);
  //dislike
  const existingDisLikes =
    await sql`SELECT "dislike" FROM posts WHERE id = ${id}`;
  const dislike = existingDisLikes[0].dislike;
  const dIndex = dislike.indexOf(deviceId);
  if (lIndex !== -1) {
    like.splice(lIndex, 1);
  } else {
    like.push(deviceId);
    if (dIndex !== -1) dislike.splice(dIndex, 1);
  }
  await sql`
    UPDATE posts
    Set "like" = ${JSON.stringify(like)} ,
    "dislike" = ${JSON.stringify(dislike)}
    WHERE id = ${id}
    `;

  const result = await sql` SELECT "like","dislike"
    FROM posts
    WHERE id= ${id} 
  `;
  return result;
}

export async function updateDisLike(id: string, deviceId: string) {
  //dislike
  const existingDisLikes =
    await sql`SELECT "dislike" FROM posts WHERE id = ${id}`;
  const dislike = existingDisLikes[0].dislike;
  const dIndex = dislike.indexOf(deviceId);
  //like
  const existingLikes = await sql`SELECT "like" FROM posts WHERE id = ${id}`;
  const like = existingLikes[0].like;
  const lIndex = like.indexOf(deviceId);
  if (dIndex !== -1) {
    dislike.splice(dIndex, 1);
  } else {
    dislike.push(deviceId);
    if (lIndex !== -1) like.splice(lIndex, 1);
  }
  await sql`
    UPDATE posts
    Set "dislike" = ${JSON.stringify(dislike)} ,
    "like" = ${JSON.stringify(like)} 
    WHERE id = ${id}
    `;
  const result = await sql` SELECT  "like","dislike"
    FROM posts
    WHERE id = ${id} 
  `;
  return result;
}

export async function createCommmentPost(id: string, content: string) {
  const existingComments =
    await sql`SELECT "comments" FROM posts where id = ${id}`;
  const comments = existingComments[0].comments;
  comments.push({
    content: content,
    id: crypto.randomUUID(),
    date: new Date(),
  });
  await sql`
  UPDATE posts
  SET "comments" = ${JSON.stringify(comments)}
  WHERE id = ${id}
  `;
  const result = await sql` SELECT "comments" 
    FROM posts 
    where id = ${id}
  `;

  return result;
}

export async function getSingle(id: string) {
  const singleShare = await sql`select * from posts WHERE id =${id}`;
  return singleShare;
}

export async function deleteSingle(id: string, deviceId: string) {
  const dates = await sql`select date,deviceid from posts where id =${id}`;
  const date = dates[0].date;
  const device = dates[0].deviceid;
  const now = new Date();
  const hoursPassed = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  if (hoursPassed > 24) {
    return {
      success: false,
    };
  }
  if (deviceId !== device) {
    return {
      success: false,
    };
  }
  if (hoursPassed < 24 && deviceId == device) {
    await sql`DELETE FROM posts WHERE id = ${id}`;
    return {
      success: true,
    };
  }
}
