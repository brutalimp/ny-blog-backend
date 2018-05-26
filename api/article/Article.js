var mongoose = require('mongoose');


var ArticleSchema = mongoose.Schema({
    name: String,
    content: Buffer,
    public: Boolean,
    owner: String,
    timestamp: Number
});

mongoose.model('Article', ArticleSchema);
module.exports = mongoose.model('Article');