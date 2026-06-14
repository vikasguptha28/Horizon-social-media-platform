import { useState, useEffect } from "react";
import axios from "axios";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/posts"
      );
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createPost = async () => {
    try {
      const formData = new FormData();

      formData.append(
        "userId",
        "6a2bce3bd0713980d591a640"
      );

      formData.append("caption", caption);

      if (file) {
        formData.append("image", file);
      }

      await axios.post(
        "http://localhost:8000/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCaption("");
      setFile(null);

      getPosts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "50px",
        }}
      >
        Social Feed
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) =>
            setCaption(e.target.value)
          }
        />

        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <button onClick={createPost}>
          Post
        </button>
      </div>

      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "30px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2>
            {post.userId?.username || "User"}
          </h2>

          <p>{post.caption}</p>

          {post.image && (
            <img
              src={`http://localhost:8000/uploads/${post.image}`}
              alt="post"
              style={{
                width: "100%",
                maxHeight: "600px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          )}

          <p>
            ❤️ {post.likes?.length || 0}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Feed;
