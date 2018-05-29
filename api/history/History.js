var mongoose = require('mongoose');

var HistorySchema = mongoose.Schema({
    articleID: String,
    viewerID: String,
    timestamp: Number,
    os: String
});

mongoose.model('History', HistorySchema);
module.exports = mongoose.model('History');
