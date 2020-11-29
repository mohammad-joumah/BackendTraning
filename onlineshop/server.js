const express = require('express');
//make an application from express() top-level function
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = 5000;
const HOST = 'localhost';
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const productController = require('./controllers/productController');

app.use(express.static(__dirname + '/public'));

// body parser use
app.use(bodyParser.urlencoded({ extended: true }));
// connect-flash use
app.use(session({
    secret: process.env.SECRET,
    cookie: {
        maxAge: 60000 * 60 * 24 // 1 day
    }
}));
app.use(flash());

// connect DB
mongoose.connect(process.env.DB_LINK + process.env.DB_NAME, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
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
app.get('/product/all', productController.getAllProduct);
app.post('/product/create', productController.createProduct);
app.get('/product/delete/:productid', productController.deleteProduct);
app.get('/product/detail/:productid', productController.getProduct);
app.get('/product/detail', productController.getProduct);

app.listen(PORT, HOST, () => {
    console.log(' The Server is running on ' + HOST + ':' + PORT)
})