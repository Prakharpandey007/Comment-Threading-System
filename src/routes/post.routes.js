const express = require("express");
const router = express.Router();
const posts = require("../services/post.service");

router.post("/createPost", (req, res, next) => {
  try {
    const post = posts.createPost(req.body.title);
    res.status(201).json(post);
  } catch (e) {
    next(e);
  }
});

// Get all posts
router.get("/getPost", (req, res, next) => {
  try {
    const allPosts = posts.listPosts();
    res.json(allPosts);
  } catch (e) {
    next(e);
  }
});

// Get single post by ID
router.get("/getPostById/:id", (req, res, next) => {
  try {
    const post = posts.ensurePost(req.params.id);
    res.json(post);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
