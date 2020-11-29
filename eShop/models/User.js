const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        firstName: {
            type: String,
            // required: [true, 'Please give your First Name']
        },
        lastName: {
            type: String,
            // required: [true, 'Please give your Last Name']
        },
        middleName: String
    },
    password: { type: String },
    email: { type: String, unique: true },
    country: String,
    country_code: { type: String, default: 'de', enum: ['de', 'en', 'sy', 'bd', 'in', 'iq', 'tr', 'ch', 'it'] },
    age: {
        type: Number,
        min: 16,
        max: 70
    },
    profilePic: {
        type: Schema.Types.ObjectId,
        ref: 'Picture'
    },
    oldProfilePic: [{
        type: Schema.Types.ObjectId,
        ref: 'Picture'
    }],
    created_at: { type: Date, default: Date.now() },
    gender: { type: Boolean, default: true },
    role: { type: String, enum: ['admin', 'customer'] },
    address: {
        street: String,
        hous_no: String,
        zip: { type: Number, min: 1000, max: 99999 },
        city: String
    },
    facebook_id: String,
    facebook_name: String
});

UserSchema.virtual('fullAddress').get(function() {
    return this.address.street + ' ,' + this.address.zip + ' ' + this.address.city;
})
UserSchema.virtual('fullName').get(function() {
    if (this.middleName)
        return this.name.firstName + ' ' + this.name.middleName + ' ' + this.name.lastName
    else return this.name.firstName + ' ' + this.name.lastName
});




const User = mongoose.model('Users', UserSchema);
module.exports = User;