const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    VERIFIED: Boolean,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    age: Number,
    dateOfBirth: Date,
    productesId: Array,
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

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;