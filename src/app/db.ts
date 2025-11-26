import {
  createCommmentPost,
  getAll,
  insertPost,
  updateDisLike,
  updateLike,
} from "./actions";

const POSTKEY = "content";
export type Post = {
  id: string;
  content: string;
  like: string[];
  dislike: string[];
  date: Date;
  comments: {
    id: string;
    content: string;
    date: Date;
  }[];
};

async function createPost(content: string) {
  const result = await insertPost(content);
  return result;
}

export async function GetPosts() {
  const result = await getAll();
  return result;
}

export async function LikePost(id: string, deviceId: string) {
  const result = await updateLike(id, deviceId);
  return result;
}

export async function DisLikePost(id: string, deviceId: string) {
  const result = await updateDisLike(id, deviceId);
  return result;
}

export function commentPost(id: string, content: string) {
  const result = createCommmentPost(id, content);
  return result;
}

export default createPost;
