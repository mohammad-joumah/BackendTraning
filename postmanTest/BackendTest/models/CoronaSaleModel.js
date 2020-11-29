const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CoronaSalesSchema = new Schema({
    shopName: String,
    toilet_tissue: String,
    area: String,
    city: String,
    rice: String,
    sugar: String,
    coronaPrecaution: String,
    card_use: String,
    cash: String
});

const CoronaSales = mongoose.model('CoronaSales', CoronaSalesSchema);

module.exports = CoronaSales;