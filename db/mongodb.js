var mongoose = require('mongoose');
var logger = require('../helper/logger');
var config = require('../config/mongodb.config')
mongoose.connect('mongodb://localhost:' + config.port + '/myblog');


var db = mongoose.connection;
db.on('error', () => {
  logger.error('connection error.')
});
db.once('open', () => {
  logger.info('mongodb connected!');
});