/**
 * controller name: productController
 * description: add, delete, update products
 * model used: Product
 */
// models
const Product = require('../models/Product');
const User = require('../models/User');
// get all products by find()
exports.getAllProduct = (req, res) => {
        let userId = req.session.user;

        Product.find((err, data) => {
            if (err) throw err.message;
            res.render('product', {
                msg: req.flash('changeInfo'),
                data,
                user: userId
                    // req.user,  
            });
        }).populate('user')
    }
    // create/add products
exports.createProduct = (req, res) => {
        req.body.user = req.session.user.id
        let newProduct = new Product(req.body);
        newProduct.save(err => {
            if (err) {
                console.log(err.message)
            }
            req.flash('changeInfo', 'New product has been added in database!')
            res.redirect('/product/all');
        })
    }
    // delete products by _id
exports.deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.productid, err => {
        req.flash('changeInfo', 'One products has been deleted!')
        res.redirect('/product/all');

    })
}

// get details of 1 product by findById()
exports.getProduct = (req, res) => {
    let productid = req.params.productid;
    Product.findById(productid, (err, data) => {
        if (err) throw err.message;
        res.render('detail', { data });
    });
}

// get detail by ajax call
exports.getProductAjax = (req, res) => {
    let productid = req.query.productid;
    Product.findById(productid, (err, data) => {
        if (err) throw err.message;
        res.json(data);
    });
}

// update 1 product using findbyIdAndUpdate()
exports.editProduct = (req, res) => {
    console.log(req.body);
    req.body.updated_at = Date.now();
    Product.findByIdAndUpdate(req.body.productid, req.body, err => {
        if (err) throw err.message;
        req.flash('changeInfo', 'One Product data has been Updated...');
        res.redirect('/product/all')
    })
}