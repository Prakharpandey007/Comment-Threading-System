const { v4: uuidv4 } = require("uuid");
const db = {
  posts: new Map(),
  commentsByPost: new Map(),
  headComment: new Map(), //rootsByPost
  subComments: new Map(),
};
function reset() {
  db.posts.clear();
  db.commentsByPost.clear();
  db.headComment.clear();
  db.subComments.clear();
}
function createPost(title) {
  const id = uuidv4();
  const post = { id, title, createdAt:new Date().toISOString()};
  db.posts.set(id, post);
  db.commentsByPost.set(id, new Map());
  db.headComment.set(id, new Set());
  db.subComments.set(id, new Map());
  return post;
}
function getPost(postId) {
  return db.posts.get(postId) || null;
}
function listPosts() {
  return Array.from(db.posts.values());
}
function addComment(postId, { user, content, head_comment_id }) {
  const comments = db.commentsByPost.get(postId);
  if (!comments) return { error: "POST_NOT_FOUND" };
  const id = uuidv4();
  let length = 1;
  if (head_comment_id) {
    const head = comments.get(head_comment_id);
    if (!head) return { error: "head_NOT_FOUND" };
    length = head.length + 1;
    if (length > 5) return { error: "MAX_length_EXCEEDED" };
  }
  const comment = {
    id,
    post_id: postId,
    user: String(user),
    timestamp: new Date().toISOString(),
    content: String(content),
    head_comment_id: head_comment_id || null,
    votes: 0,
    length,
  };
  comments.set(id, comment);
  // for the comment on the comment
  if (head_comment_id) {
    const subComment = db.subComments.get(postId);
    if (!subComment.has(head_comment_id))
      subComment.set(head_comment_id, new Set());
    subComment.get(head_comment_id).add(id);
  } else {
    db.headComment.get(postId).add(id);
  }
  return { comment };
}
function getChildComment(postId, parentId) {
  const subComment = db.subComments.get(postId);
  if (!subComment) return [];
  const set = subComment.get(parentId);
  if (!set) return [];
  return Array.from(set);
}
function getCommentsFlat(postId) {
  const comments = db.commentsByPost.get(postId);
  if (!comments) return { error: "POST_NOT_FOUND" };
  // extract each comment and extract it
  const flat = Array.from(comments.values())
    .map((c) => ({ ...c }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return { flat };
}
function buildTreeForPost(postId, collapseThreshold) {
  const comments = db.commentsByPost.get(postId);
  const roots = db.headComment.get(postId);
  if (!comments || !roots) return { error: "POST_NOT_FOUND" };

  function buildNode(id) {
    const comment = comments.get(id);
    const childIds = getChildComment(postId, id);
    const node = {
      id: comment.id,
      user: comment.user,
      timestamp: comment.timestamp,
      content: comment.content,
      head_comment_id: comment.head_comment_id,
      votes: comment.votes,
      depth: comment.depth,
      replies: [],
    };
    if (childIds.length === 0) return node;
    let idsToShow = childIds;
    let meta = null;
    if (
      Number.isInteger(collapseThreshold) &&
      collapseThreshold >= 0 &&
      childIds.length > collapseThreshold
    ) {
      idsToShow = childIds.slice(0, collapseThreshold);
      meta = {
        autoCollapsed: true,
        total_replies: childIds.length,
        hidden_count: childIds.length - collapseThreshold,
      };
    }
    node.replies = idsToShow.map(buildNode);
    if (meta) node.meta = meta;
    return node;
  }

  const tree = Array.from(roots.values()).map(buildNode);
  return { tree };
}

function findComment(postId, commentId) {
  const comments = db.commentsByPost.get(postId);
  if (!comments) return null;
  return comments.get(commentId) || null;
}

function vote(postId, commentId, toggle) {
  const comment = findComment(postId, commentId);
  if (!comment) return { error: "COMMENT_NOT_FOUND" };
  const tooglevote = Number(toggle);
  if (!Number.isInteger(tooglevote) || (tooglevote !== 1 && tooglevote !== -1))
    return { error: "INVALID_DELTA" };
  comment.votes += tooglevote;
  return { comment };
}

module.exports = {
  db,
  reset,
  createPost,
  getPost,
  listPosts,
  addComment,
  getChildComment,
  getCommentsFlat,
  buildTreeForPost,
  vote,
  findComment,
};
