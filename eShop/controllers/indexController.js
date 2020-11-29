const Product = require('../models/Product');
// show landing page
exports.landingPage = (req, res) => {
    Product.find((err, data) => {
        if (err) throw err.message;
        res.render('index', { data, user: req.user });
    })

}

//contact us form
exports.contactus = (req, res) => {
    res.render('contactus');
}

// about company info
exports.aboutus = (req, res) => {
    res.render('aboutus');
}