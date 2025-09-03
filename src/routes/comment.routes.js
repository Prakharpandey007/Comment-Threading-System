const express = require('express');
const router = express.Router({ mergeParams: true });
const comments = require('../services/comments.service');

router.post('/:postId/comments', (req, res, next) => {
  try {
    const comment = comments.addComment(req.params.postId, req.body);
    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

// Get comments (tree or flat view)
router.get('/:postId/comments', (req, res, next) => {
  try {
    const view = (req.query.view || 'tree').toString();
    const collapse =
      req.query.collapse !== undefined ? Number(req.query.collapse) : undefined;
    const data = comments.getCommentsView(req.params.postId, { view, collapse });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// Vote on a comment
router.post('/:postId/comments/:commentId/vote', (req, res, next) => {
  try {
    const { toggle } = req.body;
    const updated = comments.voteComment(
      req.params.postId,
      req.params.commentId,
      toggle
    );
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
