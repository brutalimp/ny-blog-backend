var express = require('express');
var https = require('https');
var fs = require('fs');
var config = require('./config/server.config');
var AccessControl = require('./middleware/AccessControl');
var Authorization = require('./middleware/Authorization');
var logger = require('./helper/logger');

var app = express();
var port = process.env.port || config.port;
var db = require('./db/mongodb');

app.use(AccessControl);
app.use(Authorization);

if (!fs.existsSync(config.static)) {
    fs.mkdir(config.static);
}
app.use(express.static(config.static));

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

if (config.https) {
    const options = {
        cert: fs.readFileSync('../sslcert/fullchain.pem'),
        key: fs.readFileSync('../sslcert/privkey.pem')
    };
    https.createServer(options, app).listen(config.httpsport);
}

module.exports = app;