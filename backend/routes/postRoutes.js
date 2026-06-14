const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Post = require("../models/Post");

// =======================
// Multer Configuration
// =======================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

// =======================
// Create Post
// =======================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    try {
      const newPost = new Post({
        userId: req.body.userId,
        caption: req.body.caption,

        image: req.file
          ? req.file.filename
          : "",
      });

      const savedPost =
        await newPost.save();

      const populatedPost =
        await Post.findById(
          savedPost._id
        ).populate(
          "userId",
          "username"
        );

      res.status(201).json(
        populatedPost
      );
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// =======================
// Get All Posts
// =======================

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// =======================
// Like Post
// =======================

router.put(
  "/:id/like",
  async (req, res) => {
    try {
      const post =
        await Post.findById(
          req.params.id
        );

      if (!post) {
        return res
          .status(404)
          .json({
            message:
              "Post not found",
          });
      }

      post.likes.push(
        req.body.userId
      );

      await post.save();

      res.status(200).json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

module.exports = router;
