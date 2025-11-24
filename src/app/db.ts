import { sql } from "@vercel/postgres";
const POSTKEY = "content";
export type Post = {
  id: string;
  content: string;
  like: string[];
  disLike: string[];
  date: Date;
  comments: {
    id: string;
    content: string;
    date: Date;
  }[];
};

function createPost(content: string) {
  const lStorage = localStorage.getItem(POSTKEY);
  const jLStorage = lStorage ? JSON.parse(lStorage) : [];
  jLStorage.push({
    id: crypto.randomUUID(),
    content: content,
    date: new Date(),
    like: [],
    disLike: [],
    comments: [],
  });
  localStorage.setItem(POSTKEY, JSON.stringify(jLStorage));
  return jLStorage;
}

export function GetPosts() {
  const lStorage = localStorage.getItem(POSTKEY);
  const jLStorage = lStorage ? JSON.parse(lStorage) : [];
  return jLStorage;
}

export function LikePost(id: string, deviceid: string) {
  const lStorage = localStorage.getItem(POSTKEY);
  const posts = (lStorage ? JSON.parse(lStorage) : []) as Post[];
  const index = posts.findIndex((post: Post) => post.id === id);
  const likes = posts[index].like;
  const lIndex = likes.indexOf(deviceid);
  if (lIndex !== -1) {
    likes.splice(lIndex, 1);
  } else {
    likes.push(deviceid);
  }
  localStorage.setItem(POSTKEY, JSON.stringify(posts));
  return posts;
}

export function DisLikePost(id: string, deviceid: string) {
  const lStorage = localStorage.getItem(POSTKEY);
  const posts = (lStorage ? JSON.parse(lStorage) : []) as Post[];

  const index = posts.findIndex((post: Post) => post.id === id);
  const dislikes = posts[index].disLike;
  const dIndex = dislikes.indexOf(deviceid);

  if (dIndex !== -1) {
    dislikes.splice(dIndex, 1);
  } else {
    dislikes.push(deviceid);
  }
  localStorage.setItem(POSTKEY, JSON.stringify(posts));
  return posts;
}

export function commentPost(id: string, content: string) {
  const lStorage = localStorage.getItem(POSTKEY);
  const posts = lStorage ? JSON.parse(lStorage) : [];
  const index = posts.findIndex((posts: Post) => posts.id === id);
  posts[index].comments.push({
    id: crypto.randomUUID(),
    content: content,
    date: new Date(),
  });
  localStorage.setItem(POSTKEY, JSON.stringify(posts));
  return posts;
}

export async function fetchData() {
  const { rows } = await sql`SELECT * FROM users;`;
  return rows;
}

export default createPost;
