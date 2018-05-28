var mongoose = require('mongoose');


var ArticleSchema = mongoose.Schema({
    name: String,
    owner: String,
    filename: String,
    content: Buffer,
    public: Boolean,
    type: String,
    timestamp: Number
});

mongoose.model('Article', ArticleSchema);
module.exports = mongoose.model('Article');