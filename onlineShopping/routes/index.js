const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Product = require('../models/productModel');
const app = express();
const URL = require('url');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
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

// flash
const flash = require('connect-flash');
app.use(flash());


// main routs
router.get('/', (req, res) => {
    Product.find((err, data) => {
        // console.log(data)
        res.render('index', { userLogin: req.session.login, data, message: req.flash('info') })
    })

})

// sign in routs
function chicklogin(req, res, next) {

    if (req.session.login) {

        res.redirect('/profile');
    }
    next();
}
router.get('/signin', chicklogin, (req, res) => {
    res.render('signin', { message: req.flash('info') });
})
router.post('/signin', (req, res) => {
    let userData = req.body;
    User.findOne({ email: userData.email }, (err, data) => {
        if (err) throw err;
        // console.log(data)
        // console.log(userData)
        if (data != null && userData.password == data.password) {
            // userLogin = data
            // if (data.VERIFIED == false) {
            //     VERIFIEDmsg = 'please verifi your email'
            // } else {
            //     VERIFIEDmsg = null;
            // }
            req.session.login = data;
            req.session.save();
            // req.flash('info', 'Log in is success')
            res.redirect('/profile');


        } else {
            req.flash('info', 'wrong email or Password')
                // res.render('signin', { message: 'wrong Email or password' })
            res.redirect('/signin')
                // res.send('wrong info')
        }
    })
});

// signup routs
router.get('/signup', (req, res) => {
    res.render('signup', { userLogin: req.session.login, message: req.flash('info') })
})

function chickemail(req, res, next) {


}
router.post('/sign', upload.single('upload'), (req, res) => {
    let userInfo = req.body;
    User.find((err, data) => {
        if (err) throw err;
        for (emai of data) {
            if (emai == userInfo.email) {
                req.flash('info', 'you are already Registerd');
                res.redirect('/signup');
                break;
            }
        }


        let newUser = new User({
            VERIFIED: false,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            password: userInfo.password,
            age: userInfo.age,
            dateOfBirth: userInfo.bDate,
            photo: req.file,
            created: Date.now()
        });
        newUser.save(() => {
            res.redirect('/signin')
        });



    });


});

// profile routs
function chicklogin1(req, res, next) {

    if (!req.session.login) {

        res.redirect('/signin');
    }
    next();
}
router.get('/profile', chicklogin1, (req, res) => {
    Product.find((err, data) => {
        let userProduct = [];
        for (item of data) {
            if (item.addBy == req.session.login.email) {
                userProduct.push(item);
            }
        }
        if (userProduct == [null]) res.render('profile', { userLogin: req.session.login });
        else res.render('profile', { userLogin: req.session.login, userProduct })
    })

})

// contact routs
router.get('/contact', (req, res) => {
    res.render('contact', { userLogin: req.session.login })
})

// siging out
router.get('/signout', (req, res) => {
    // userLogin = null;
    // req.session.destroy();
    req.session.login = null;
    res.redirect('/')
});


// Product routs
router.get('/product', chicklogin1, (req, res) => {
    res.render('product', { userLogin: req.session.login })
});
router.post('/product', upload.single('upload'), (req, res) => {

    userInfo = req.body;

    let newProduct = new Product({
        articaleName: userInfo.articaleName,
        articalePrice: userInfo.articalePrice,
        description: userInfo.description,
        addBy: req.session.login.email,
        photo: req.file,
        created: Date.now()
    });
    // console.log(newProduct)
    newProduct.save(() => {
        req.session.login.productesId.push(newProduct._id);
        User.findByIdAndUpdate(req.session.login._id)
        res.redirect('/profile')
    });

});

// Profile Edit routs
router.get('/profileEdit', chicklogin1, (req, res) => {
    res.render('profileEdit', { userLogin: req.session.login })
});

router.post('/profileEdit', upload.single('uploadPic'), (req, res) => {
    let userInfo = req.body;
    let path = 'public/img/' + req.session.login.photo.filename;
    let id = req.session.login._id;
    //find delete old picture
    fs.unlinkSync(path);
    let userUpdate = {
        VERIFIED: false,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        password: userInfo.password,
        age: userInfo.age,
        dateOfBirth: userInfo.bDate,
        photo: req.file,
        created: Date.now()
    }

    // update new Info
    User.findByIdAndUpdate(id, userUpdate, (err) => {
        User.findById(id, (err, data) => {
            req.session.login = data;
            req.session.save();
            res.redirect('/profile');
        })
    })
})

router.get('/productID/:id', (req, res) => {
    let id = req.params.id;

    Product.findById(id, (err, data) => {
        let edit = `<a href="/editProduct/${data._id}"><button type="button" class="btn btn-secondary">Edit</button></a>`;
        if (req.session.login != null)
            if (data.addBy == req.session.login.email) {
                res.render('productId', { userLogin: req.session.login, data, edit })
            }
        res.render('productId', { userLogin: req.session.login, data })
    });

});

// Puying routs
router.post('/puy', (req, res) => {
    req.flash('info', 'you are already Registerd');
    res.redirect('/')
});

// Edit Product
router.get('/editProduct/:id', chicklogin1, (req, res) => {
    let id = req.params.id;
    Product.findById(id, (err, data) => {

        res.render('editProduct', { userLogin: req.session.login, data })
    });

});

router.post('/:id/:filename', upload.single('uploadProductPic'), (req, res) => {
    let id = req.params.id,
        filename = req.params.filename;

    console.log(req.file)
    let productInfo = req.body;
    let path = 'public/img/' + filename;
    let productUpdate = {
        articaleName: productInfo.articaleName,
        articalePrice: productInfo.articalePrice,
        description: productInfo.description,
        addBy: req.session.login.email,
        photo: req.file
    }


    // 


    Product.findByIdAndUpdate(id, productUpdate, (err) => {
        fs.unlinkSync(path);
        Product.findById(id, (err, data) => {
            res.redirect(`/ProductId/${data._id}`)
        })

    });


});

router.get('/contact', (req, res) => {
    res.render('contact', { userLogin: req.session.login, })
});
router.post('/send', (req, res) => {
    msgInfo = req.body;
    console.log(msgInfo)
    let text = `
    <div style="background-color: #a88e8e; ">
        <h3 style="color: blue;">You got message from ${msgInfo.name}</h3>
        <h3 style="color: blue;">email Address is  ${msgInfo.email}</h3>
        <p>the message is: <br> ${msgInfo.message}</p>
    </div>`
    let msg = {
        to: 'mohammad.joumah@gmail.com',
        from: 'mohammad.joumah@gmail.com',
        subject: msgInfo.subject,
        html: text
    }
    console.log(msg)
    sgMail.send(msg, (err, info) => {
        if (err) throw res.render('contact', { msg: 'not sent' });
        //  res.send('not sent');
        console.log('the message is sent');
        // res.send('the message is sent');
        res.render('contact', { msg: 'the message is sent' })
    });

})
module.exports = router