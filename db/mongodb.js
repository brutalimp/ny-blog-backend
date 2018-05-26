var mongoose = require('mongoose');
var logger = require('../helper/logger')
mongoose.connect('mongodb://localhost:27017/myblog');


var db = mongoose.connection;
db.on('error', () => {
  logger.error('connection error.')
});
db.once('open', () => {
  logger.info('mongodb connected!');
});