"use client";
import { useEffect, useState } from "react";
import createPost, {
  commentPost,
  DisLikePost,
  fetchData,
  GetPosts,
  LikePost,
  Post,
} from "./db";
import bankerslogo from "./Icon/bankers.png";

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
    setPosts(GetPosts());
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
              onClick={() => {
                if (textV) {
                  const newPost = createPost(textV);
                  setTextV("");
                  setPosts(newPost);
                }
              }}
            >
              Post!
            </button>
          </div>
        </div>
        <div className="containerMessages">
          {[...posts].reverse().map((post: Post) => {
            const comments = post.comments;
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
                  <div className="userName">{formattedDate}</div>
                  <div className="message">{post.content}</div>
                  <div className="action">
                    <button
                      onClick={() => {
                        if (deviceID) {
                          const newPosts = LikePost(post.id, deviceID);
                          if (newPosts) setPosts(newPosts);
                        }
                      }}
                    >
                      {post.like.length}👍like
                    </button>
                    <button
                      onClick={() => {
                        if (deviceID) {
                          const newPosts = DisLikePost(post.id, deviceID);
                          if (newPosts) setPosts(newPosts);
                        }
                      }}
                    >
                      {post.disLike.length}👎dislike
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
                      onClick={() => {
                        const newPost = commentPost(post.id, com);
                        setPosts(newPost);
                        setTextbox(undefined);
                      }}
                    >
                      submit
                    </button>
                  </div>
                  <div>
                    {[...comments].reverse().map((id) => {
                      const commentDate = new Date(id.date).toLocaleString(
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
                        <div className="">
                          <div className="userName">{commentDate}</div>
                          <div className="message">{id.content}</div>
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
