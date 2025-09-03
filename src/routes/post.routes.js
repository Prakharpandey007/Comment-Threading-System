const express = require("express");
const router = express.Router();
const posts = require("../services/posts.service");

router.post("/createPost", (req, res, next) => {
  try {
    const post = posts.createPost(req.body.title);
    res.status(201).json(post);
  } catch (e) {
    next(e);
  }
});

router.get("/getPost", (req, res) => {
  res.json(posts.listPosts());
});

module.exports = router;
