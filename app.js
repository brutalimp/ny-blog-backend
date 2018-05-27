var express = require('express');
var AccessControl = require('./middleware/AccessControl');
var Authorization = require('./middleware/Authorization');
var logger = require('./helper/logger');

var app = express();
var port = process.env.port || 3000;
var db = require('./db/mongodb');

app.use(AccessControl);
app.use(Authorization);

var AuthController = require('./api/auth/AuthController');
app.use('/api/auth', AuthController);

var PublicController = require('./api/public/PublicController');
app.use('/api/public', PublicController);

var UserController = require('./api/user/UserController');
app.use('/api/users', UserController);

var ArticleController = require('./api/article/ArticleController');
app.use('/api/article', ArticleController);

var server = app.listen(port, () => {
    logger.info('Express server listening on port ' + port);
})

module.exports = app;