const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema =new Schema({
    url: String,
    filename: String
});

const opts = { toJSON: { virtuals: true } };

module.exports = ImageSchema

module.exports = mongoose.model('Image', ImageSchema)

