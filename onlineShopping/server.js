// express
const express = require('express');
const app = express();
const fs = require('fs');
// bodyParser
const bodyParser = require('body-parser');
// setup body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose
const mongoose = require('mongoose');
// setup mongoose
mongoose.connect('mongodb+srv://admin:M0h@mmed@mohammad.v7aku.mongodb.net/Mohammad', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Your MongoDB is connected......')
    })
    .catch(err => console.log('Your ERROR is : ' + err));

// express session
const session = require('express-session');
// setup session
app.use(session({ secret: 'try it' }));

// multer
const multer = require('multer');
// setup multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img');
    },

    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({
    storage: storage
});


// handlebars
const hbs = require('hbs');
// View Engine Setups(TEMPLATE ENGINE SETUP)
app.set('view engine', 'hbs');

// sendGrid
const sgMail = require('@sendgrid/mail');
// setup sendGrid
sgMail.setApiKey('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');

// connect-flash
const flash = require('connect-flash');
app.use(flash());

// setup static folder for external files
app.use(express.static(__dirname + '/public'))

// creating routs
const indexRouter = require('./routes/index');
// routes
app.use('/', indexRouter)




// listen part
app.listen(5500, () => {
    console.log('Server is running.....')
})