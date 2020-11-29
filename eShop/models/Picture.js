const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PictureSchema = new Schema({

    fieldname: String,
    originalname: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
});

const Picture = mongoose.model('Picture', PictureSchema);
module.exports = Picture;