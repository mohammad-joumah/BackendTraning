const express = require('express');
//make an application from express() top-level function
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = 5000;
const multer = require('multer');
const fs = require('fs');
const HOST = 'localhost';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const indexRouter = require('./routes/index');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

const accessTokenSecret = process.env.TOKEN_SECRET;


// body parser use
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const hbs = require('hbs');

// helper settings
hbs.registerHelper('dateFormat', (data) => {
    if (!data) {
        return 'Not updated yet';
    }
    return data.toLocaleDateString();
})
hbs.registerHelper('timeFormat', (data) => {
    if (!data) {
        return 'Not updated yet';
    }
    return data.toLocaleTimeString();
});
hbs.registerHelper('ifCond', (v1, v2) => {
    if (v1 == v2) {
        return true;
    }
    return false;
});
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartial('header', 'header.hbs');
hbs.registerPartial('footer', 'footer.hbs');

// static folder use
app.use(express.static(__dirname + '/public'));

// Multer setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/image');
    },

    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});


const upload = multer({
    storage: storage

});


function onlyImage(req, res, next) {
    // check the file extension: .jpg, .png, .jpeg, .gif etc
    // if file is not .jpg/.png than delete the file and ask user to upload right file type
    const fileExt = path.extname(req.file.originalname);
    console.log(fileExt);
    if (fileExt == '.jpg' || fileExt == '.png' || fileExt == '.jpeg' || fileExt == '.gif') {
        next();
    } else {
        fs.unlink(req.file.path, (err) => console.log('file doesnot support'));
        successMsg = 'Wrong type! Please upload a .jpg/.png image only'
        res.redirect('/imageUpload');
    }
}

// session use
app.use(session({
    secret: process.env.SECRET,
    cookie: {
        maxAge: 60000 * 60 * 24 // 1 day
    }
}));
// connect-flash use
app.use(flash());




// connect DB
mongoose.connect(process.env.DB_LINK + process.env.DB_NAME, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {
        console.log('MongoDB database is connected........');
    })
    .catch((error) => {
        console.log('Database is not connected because:' + error.message)
    });

// View engine setup
app.set('view engine', 'hbs');

// Routes
app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/user', userRouter);

const { body, validationResult } = require('express-validator');
app.use(express.json());
app.get('/test/create', (req, res) => {
    res.render('test', { errors: req.flash('errors') });
})
app.post('/test/user', [
    // check is not empty
    body('username').not().isEmpty().withMessage('User Name is Empty'),
    body('password')
    .notEmpty().withMessage('Password is Empty')
    .bail()
    .isLength({ min: 4 }).withMessage('Password must be 4 chars!')
    .bail()
    .matches(/[0-9]/).withMessage('must contain a number')
    .bail()
    .matches(/\d/).withMessage('Must contain One big latter')
], (req, res) => {
    const result = validationResult(req);
    let errors = result.array()
        // console.log(errors);
    if (errors.length != 0)
    // console.log(errors);
        req.flash('errors', errors)
        // }
        // res.render('test', { errors: errors });
    res.redirect('/test/create')
})



app.listen(PORT, HOST, () => {
    console.log(' The Server is running on ' + HOST + ':' + PORT)
})