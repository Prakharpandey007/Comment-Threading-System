const express = require('express');
const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comment.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
app.use('/posts', postsRoutes);
app.use('/posts', commentsRoutes);
// for error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
