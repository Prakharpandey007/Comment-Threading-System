const store = require("../store/memoryStore");
const {ensurePost} = require("./post.service");

function addComment(postId, { user, content, head_comment_id = null }) {
  ensurePost(postId);
  if (!user || !content) {
    const err = new Error("user and content are required");
    err.status = 400;
    err.code = "VALIDATION_ERROR";
    throw err;
  }
  const result = store.addComment(postId, { user, content, head_comment_id });
  if (result.error) {
    const err = new Error(result.error);
    if (result.error === "PARENT_NOT_FOUND") {
      err.status = 404;
      err.code = result.error;
    } else if (result.error === "MAX_LENGTH_EXCEEDED") {
      err.status = 400;
      err.code = result.error;
    } else if (result.error === "POST_NOT_FOUND") {
      err.status = 404;
      err.code = result.error;
    } else {
      err.status = 400;
      err.code = result.error;
    }
    throw err;
  }
  return result.comment;
}

function getCommentsView(postId, { view = "tree", collapse } = {}) {
  ensurePost(postId);
  if (view === "flat") {
    const result = store.getCommentsFlat(postId);
    return result.flat;
  }
  const threshold = collapse !== undefined ? Number(collapse) : undefined;
  const result = store.buildTreeForPost(postId, threshold);
  return result.tree;
}

function voteComment(postId, commentId, toggle) {
  ensurePost(postId);
  const result = store.vote(postId, commentId, toggle);
  if (result.error) {
    const err = new Error(result.error);
    err.status = 400;
    err.code = result.error;
    if (result.error === "COMMENT_NOT_FOUND") err.status = 404;
    throw err;
  }
  return result.comment;
}

module.exports = { addComment, getCommentsView, voteComment };
