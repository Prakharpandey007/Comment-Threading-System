const store = require("../store/memoryStore");

function createPost(title) {
  if (!title || typeof title !== "string") {
    const err = new Error("title is required");
    err.status = 400;
    err.code = "VALIDATION_ERROR";
    throw err;
  }
  return store.createPost(title.trim());
}

function listPosts() {
  return store.listPosts();
}

function ensurePost(postId) {
  const post = store.getPost(postId);
  if (!post) {
    const err = new Error("Post not found");
    err.status = 404;
    err.code = "POST_NOT_FOUND";
    throw err;
  }
  return post;
}

module.exports = { createPost, listPosts, ensurePost };
