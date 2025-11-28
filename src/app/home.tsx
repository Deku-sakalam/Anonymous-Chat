"use client";
import { useEffect, useState } from "react";
import createPost, {
  commentPost,
  deletePost,
  DisLikePost,
  GetPosts,
  LikePost,
  Post,
  sharePost,
} from "./db";

export default function AnonymousChat(props: { handle: string }) {
  const { handle } = props;
  const [hidden, setHidden] = useState(true);
  const [textV, setTextV] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [com, setCom] = useState("");
  const [textbox, setTextbox] = useState<string | undefined>();
  const [deviceId, setDeviceId] = useState<string>();
  const [likeloading, setLikeLoading] = useState(false);
  const [disLikeloading, setDisLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const existingDeviceID = localStorage.getItem("DeviceId");
    if (!existingDeviceID) {
      const randomId = crypto.randomUUID();
      localStorage.setItem("DeviceId", randomId);
      setDeviceId(randomId);
    } else {
      setDeviceId(existingDeviceID);
    }
  }, []);
  console.log("posts", posts);
  useEffect(() => {
    GetPosts(handle).then((result) => {
      if (result)
        setPosts(result.sort((a, b) => b.like.length - a.like.length));
    });
  }, [handle]);

  useEffect(() => {
    if (!textV) {
      setHidden(true);
    }
  }, [textV]);
  return (
    <div className="wrapper">
      <div className="body">
        <div className="box">
          <div className="upperbox">Create A Post Anonymously </div>
          <div className="lowerbox">
            <textarea
              className="textarea"
              value={textV}
              onChange={(e) => {
                setTextV(e.target.value);
                setHidden(false);
              }}
            ></textarea>
          </div>
          <div className="send" hidden={hidden}>
            <button
              onClick={async () => {
                setTextbox("closed");
                if (textV) {
                  if (deviceId) {
                    const newPost = await createPost(textV, handle, deviceId);
                    setPosts((p) => [...p, ...(newPost as Post[])]);
                    setTextV("");
                  }
                }
              }}
            >
              Post!
            </button>
          </div>
        </div>
        <div className="containerMessages">
          {posts.map((post: Post) => {
            const comments = post.comments ?? [];
            const formattedDate = new Date(post.date).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            });
            return (
              <div className="parentMessage" key={post.id}>
                <div className="containerMessage">
                  <div className="userName">
                    Anonymous {formattedDate}
                    {post.deviceid === deviceId ? (
                      <button
                        onClick={async () => {
                          if (deviceId) {
                            const result = await deletePost(post.id, deviceId);
                            if (result) {
                              if (!result.success) {
                                setShowError(true);
                                setTimeout(() => setShowError(false), 3000);
                              } else {
                                setShowSuccess(true);
                                setTimeout(() => setShowSuccess(false), 3000);
                                setPosts((p) =>
                                  p.filter((d) => d.id !== post.id)
                                );
                              }
                            }
                          }
                        }}
                      >
                        🗑️
                      </button>
                    ) : null}
                  </div>
                  <div className="message">{post.content}</div>
                  <div className="action">
                    <button
                      disabled={likeloading}
                      onClick={() => {
                        if (deviceId) {
                          setLikeLoading(true);
                          LikePost(post.id, deviceId).finally(() => {
                            setLikeLoading(false);
                          });
                          setPosts((p) => {
                            return p.map((p) =>
                              p.id === post.id
                                ? {
                                    ...p,
                                    like: p.like.includes(deviceId)
                                      ? p.like.filter((d) => d !== deviceId)
                                      : [...p.like, deviceId],

                                    dislike: p.dislike.includes(deviceId)
                                      ? p.dislike.filter((d) => d !== deviceId)
                                      : p.dislike,
                                  }
                                : p
                            );
                          });
                        }
                      }}
                    >
                      {post.like?.length}👍like
                    </button>
                    <button
                      disabled={disLikeloading}
                      onClick={() => {
                        setDisLikeLoading(true);
                        if (deviceId) {
                          DisLikePost(post.id, deviceId).finally(() => {
                            setDisLikeLoading(false);
                          });
                          setPosts((p) => {
                            return p.map((p) =>
                              p.id === post.id
                                ? {
                                    ...p,
                                    dislike: p.dislike.includes(deviceId)
                                      ? p.dislike.filter((d) => d !== deviceId)
                                      : [...p.dislike, deviceId],

                                    like: p.like.includes(deviceId)
                                      ? p.like.filter((d) => d !== deviceId)
                                      : p.like,
                                  }
                                : p
                            );
                          });
                        }
                      }}
                    >
                      {post.dislike?.length}👎dislike
                    </button>
                    <button
                      onClick={() => {
                        setTextbox(post.id);
                        setCom("");
                      }}
                    >
                      💬Comment
                    </button>
                    <button
                      onClick={() => {
                        sharePost(post.id);
                      }}
                    >
                      ➣Share
                    </button>
                  </div>
                  <div className={textbox === post.id ? "textbox" : "closed"}>
                    <textarea
                      value={com}
                      onChange={(e) => {
                        setCom(e.target.value);
                      }}
                    ></textarea>
                    <button
                      disabled={commentLoading}
                      onClick={async () => {
                        setCommentLoading(true);
                        const newPost = await commentPost(post.id, com).finally(
                          () => {
                            setCommentLoading(false);
                          }
                        );
                        setPosts((p) => {
                          return p.map((p) =>
                            p.id === post.id
                              ? {
                                  ...p,
                                  comments: newPost[0].comments,
                                }
                              : p
                          );
                        });
                        setTextbox(undefined);
                      }}
                    >
                      submit
                    </button>
                  </div>
                  <div>
                    {[...comments].reverse().map((comment) => {
                      const commentDate = new Date(comment.date).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      );
                      return (
                        <div className="" key={comment.id}>
                          <div className="userName">{commentDate}</div>
                          <div className="message">{comment.content}</div>
                        </div>
                      );
                    })}
                  </div>
                  {showSuccess && (
                    <div className="successBox">
                      ✅ Post successfully deleted!
                    </div>
                  )}
                </div>
                {showError && (
                  <div className="errorBox">❌ Failed to delete post!</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
