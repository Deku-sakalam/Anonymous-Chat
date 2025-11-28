import {
  createCommmentPost,
  deleteSingle,
  getAll,
  getSingle,
  insertPost,
  updateDisLike,
  updateLike,
} from "./actions";

export type Post = {
  deviceId: string;
  id: string;
  content: string;
  like: string[];
  dislike: string[];
  date: Date;
  handle: string;
  comments: {
    id: string;
    content: string;
    date: Date;
  }[];
};

async function createPost(content: string, handle: string, deviceId: string) {
  const result = await insertPost(content, handle, deviceId);
  return result;
}

export async function GetPosts(handle: string) {
  const result = await getAll(handle);
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

export async function commentPost(id: string, content: string) {
  const result = await createCommmentPost(id, content);
  return result;
}
export async function sharePost(id: string) {
  const result = await getSingle(id);
  return result;
}
export async function deletePost(id: string, deviceId: string) {
  const result = await deleteSingle(id, deviceId);
  return result;
}
export default createPost;
