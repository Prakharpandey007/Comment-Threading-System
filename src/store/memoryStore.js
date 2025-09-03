const { v4: uuidv4 } = require("uuid");
const db = {
  posts: new Map(),
  commentsByPost: new Map(),
  rootsByPost: new Map(),
  childrenByPost: new Map(),
};
function reset() {
  db.posts.clear();
  db.commentsByPost.clear();
  db.rootsByPost.clear();
  db.childrenByPost.clear();
}
function createPost(title) {
  const id = uuidv4();
  const post = { id, title, createdAt: Date.now() };
  db.posts.set(id, post);
  db.commentsByPost.set(id, new Map());
  db.rootsByPost.set(id, new Set());
  db.childrenByPost.set(id, new Map());
  return post;
}
function getPost(postId) {
  return db.posts.get(postId) || null;
}
function listPosts() {
  return Array.from(db.posts.values());
}
