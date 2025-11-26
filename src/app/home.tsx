"use client";
import { useEffect, useState } from "react";
import createPost, {
  commentPost,
  DisLikePost,
  GetPosts,
  LikePost,
  Post,
} from "./db";
import bankerslogo from "./icon/bankers.png";

export default function AnonymousChat() {
  const [hidden, setHidden] = useState(true);
  const [textV, setTextV] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [com, setCom] = useState("");
  const [textbox, setTextbox] = useState<string | undefined>();
  const [deviceID, setDeviceId] = useState<string>();

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

  useEffect(() => {
    GetPosts().then((result) => {
      if (result) setPosts(result);
    });
  }, []);

  useEffect(() => {
    if (!textV) {
      setHidden(true);
    }
  }, [textV]);
  return (
    <div className="wrapper">
      <div className="body">
        <div className="box">
          <div className="upperbox">
            <img
              className="bankers"
              src={bankerslogo.src}
              alt={bankerslogo.src}
            />
            Bankers Village 1 HomeOwners Association
          </div>
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
                if (textV) {
                  const newPost = await createPost(textV);
                  setPosts((p) => [...p, ...(newPost as Post[])]);
                  setTextV("");
                }
              }}
            >
              Post!
            </button>
          </div>
        </div>
        <div className="containerMessages">
          {[...posts].reverse().map((post: Post) => {
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
                  <div className="userName">Anonymous {formattedDate}</div>
                  <div className="message">{post.content}</div>
                  <div className="action">
                    <button
                      onClick={async () => {
                        if (deviceID) {
                          const newPosts = await LikePost(post.id, deviceID);
                          setPosts((p) => {
                            return p.map((p) =>
                              p.id === post.id
                                ? {
                                    ...p,
                                    like: newPosts[0].like,
                                    dislike: newPosts[0].dislike,
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
                      onClick={async () => {
                        if (deviceID) {
                          const newPosts = await DisLikePost(post.id, deviceID);
                          setPosts((p) => {
                            return p.map((p) =>
                              p.id === post.id
                                ? {
                                    ...p,
                                    like: newPosts[0].like,
                                    dislike: newPosts[0].dislike,
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
                    <button>➣Share</button>
                  </div>
                  <div className={textbox === post.id ? "textbox" : "closed"}>
                    <textarea
                      value={com}
                      onChange={(e) => {
                        setCom(e.target.value);
                      }}
                    ></textarea>
                    <button
                      onClick={async () => {
                        const newPost = await commentPost(post.id, com);
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
