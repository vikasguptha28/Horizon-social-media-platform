const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Comment = require("../models/Comment");

// Create Comment
router.post("/", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "username");

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Comments By Post
router.get("/:postId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const comments = await Comment.find({
      postId: req.params.postId,
    }).populate("userId", "username");

    res.json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Comment
router.delete("/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);

    res.json({
      message: "Comment deleted",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
