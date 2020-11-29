const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User')
const facebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body } = require('express-validator');
const multer = require('multer');
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
let facebookCLientId = process.env.FACEBOOK_CLIENT_ID;
let facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET

passport.serializeUser(function(user, cb) {
    cb(null, user);
})
passport.deserializeUser(function(obj, cb) {
    cb(null, obj)
})

passport.use(new facebookStrategy({
        clientID: facebookCLientId,
        clientSecret: facebookClientSecret,
        callbackURL: 'http://localhost:5000/user/auth/facebook/return',
        profile: ['id', 'displayName']
    },
    function(accesToken, refreshToken, profile, cb) {
        User.findOne({ facebook_id: profile.id }, (err, user) => {
            if (err) throw err.message;
            if (user) {
                cb(null, user);
            } else {
                newUser = new User({
                    // name: profile.name,
                    facebook_id: profile.id,
                    facebook_name: profile.displayName
                });
                newUser.save(err => {
                    if (err) throw err;
                    console.log('Facebook is greated...')
                    cb(null, user)
                });
            }
        })
    }))

router.use(passport.initialize());
router.use(passport.session());

const userController = require('../controllers/userController');
// Signup form
router.get('/create', userController.signup);

// creat fake accunt
router.get('/fakeAcc', userController.fakeAcc);

// testsignup
router.get('/faker', userController.fakeTest);
// create a User Account
router.post('/create', [
    body('password')
    .notEmpty().withMessage('Password is Empty')
    .bail()
    .isLength({ min: 4 }).withMessage('Password must be 4 chars!')
    .bail()
    .matches(/[0-9]/).withMessage('must contain a number')
    .bail()
    .matches(/\d/).withMessage('Must contain One big latter'),
    body('email')
    .isEmail().withMessage('Email is not correct. write @ and a .')
    .custom(value => {
        // find a user by email
        return User.findOne({ email: value })
            .then(user => {
                if (user) {
                    return Promise.reject('This email is already in use! Please try with different emails!');
                }
            })
    })
], userController.createUser);
// login form
router.get('/login', userController.loginCheck, userController.login);

router.post('/login', userController.userlogin);
// profile page
router.get('/profile', userController.permission, userController.getProfile);

router.get('/profilefake', userController.permission, userController.getProfilefake)
    // Upload profile pic
router.post('/uploadpic', upload.single('upload'), userController.uploadPic);
// Delete the pic
router.get('/getDetail', userController.getPicAjax);
// logout buttom
router.get('/logout', userController.logout);
// order
router.get('/order', userController.authenticateJwt, userController.getOrder);

// jwt test login
router.get('/jwt/login', userController.loginCheck, userController.jwtLogin)

router.post('/jwt/login', userController.jwtUserlogin)

// fake login
router.get('/loginfake', userController.loginCheck, userController.jwtLoginFake);

router.post('/loginfake', userController.jwtUserloginFake)

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/return', passport.authenticate('facebook', {
        failureRedirect: '/user/jwt/login',
        // successRedirect: '/user/facebook/profile'
    }), (req, res) => {
        const payload = {
            id: req.user._id
        };
        // const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        // req.session.token = token;
        userController.getToken(payload, req)
            // console.log(req.user)
        req.flash('seccessMSG', 'You loged in with facebook');
        res.redirect('/user/profile')
    }

);
// router.get('facebook/profile',(req,res)=>{
//     console.log(user)
//     res.json('Facebook login is successful!')
// })

// search routs test
router.post('/search/email', userController.getUserByEmail);

// search route
router.post('/search', userController.getUserBy);

module.exports = router;