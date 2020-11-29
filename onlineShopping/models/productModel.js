const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    articaleName: String,
    articalePrice: Number,
    description: String,
    addBy: String,
    photo: {
        fieldname: String,
        originalname: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number
    },
    created: Date
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;