const express = require('express');
const postsRoutes = require('./routes/post.routes');
const commentsRoutes = require('./routes/comment.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
app.use('/api/posts', postsRoutes);
app.use('/api/posts', commentsRoutes);
// for error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
