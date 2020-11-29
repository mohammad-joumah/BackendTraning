/**
 * controller name: productController
 * description: add, delete, update products
 * model used: Product
 */
// models
const Product = require('../models/Product');

// get all products by find()
exports.getAllProduct = (req, res) => {
        Product.find((err, data) => {
            if (err) throw err.message;
            res.render('index', {
                msg: req.flash('changeInfo'),
                data
            });
        });
    }
    // create/add products
exports.createProduct = (req, res) => {
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
    Product.findById(req.params.productid, (err, data) => {
        if (err) throw err.message;
        res.render('productId', {
            data
        });
    })
}

// exports.getProduct = (req, res) => {
//     let id = req.query.productid;
//     Product.findById(req.params.productid, (err, data) => {
//         if (err) throw err.message;
//         res.json(data);
//     })
// }

// update 1 product using findbyIdAndUpdate()
exports.getUpdate = (req, res) => {
    Product.findById(req.params.productid, (err, data) => {
        if (err) throw err.message;
        res.render('editProduct', {
            data
        });
    })
}