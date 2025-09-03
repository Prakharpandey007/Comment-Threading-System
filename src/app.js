const express = require('express');
const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');
const errorHandler = require('./middleware/errorHandler');
const app = express();
app.use(express.json());
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes); // nested comments routes
app.use(errorHandler);
module.exports = app;