const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Picture = require('../models/Picture')
const { validationResult } = require('express-validator');
const faker = require('faker');
const { search } = require('../routes/user');

let name = 'Mohammad';
let wrongName = 'Joumah'
let saltRound = Number(process.env.saltRound);
let hashedname;
// bcrypt.hash(name, saltRound, (err, newHashedData) => {
//     console.log(newHashedData);
//     hashedname = newHashedData;
// });
// setTimeout(() => {
//     bcrypt.compare(name, hashedname, (err, result) => {
//         console.log(result)
//     })
// }, 2000)

const accessTokenSecret = process.env.TOKEN_SECRET;

// login check middleware
exports.loginCheck = (req, res, next) => {
        // if (!req.session.thisUser) {
        if (req.session.token) {
            res.redirect('/user/profile')
        } else {

            next();
        }
    }
    // permission
exports.permission = (req, res, next) => {
    // if (req.session.thisUser) {
    if (req.session.token) {
        next();
    } else {
        res.redirect('/user/jwt/login')
    }
}

// user login form
exports.login = (req, res) => {
    res.render('login', { successMSG: req.flash('successMSG'), errorMSG: req.flash('errorMSG') })
}

// check user login
exports.userlogin = (req, res) => {
        console.log(req.user)
        const { email, password } = req.body;
        User.find((err, users) => {
            for (user of users) {
                if (email == user.email && password == user.password) {

                    req.session.thisUser = user;

                    break;
                }
            }
            if (req.session.thisUser) {
                req.flash('seccessMSG', user.fullName + ' is succesfully login');
                res.redirect('/user/profile');
            } else {
                req.flash('errorMSG', 'Wrong Email or Password');
                res.redirect('/user/login');
            }
        })
    }
    // profile page
exports.getProfile = (req, res) => {
    // console.log(req.session.thisUser)
    // if (req.user != undefined) {
    // console.log(req.user)
    User.findById(req.session.user.id, (err, user) => {
        if (err) throw err;
        // console.log(user)
        res.render('profile', { seccessMSG: req.flash('seccessMSG'), user });
    }).populate('profilePic').populate('oldProfilePic')

    // } else
    //     res.render('profile', { seccessMSG: req.flash('seccessMSG'), user: req.session.thisUser });

}

// Upload profile pic 
exports.uploadPic = (req, res) => {

        let newPicture = new Picture(req.file); //save data

        newPicture.save(err => {
            // console.log(newPicture._id)
            User.findById(req.session.user.id, (err, user) => {
                // , { profilePic: newPicture._id }
                if (err) throw err
                let newAlbom = user.oldProfilePic;
                newAlbom.push(newPicture._id);
                console.log(newAlbom);
                User.findByIdAndUpdate(req.session.user.id, { profilePic: newPicture._id, oldProfilePic: newAlbom }, err => {
                    if (err) throw err;
                    res.redirect('/user/profile');
                })

            })

        })
    }
    // get picture
exports.getPicAjax = (req, res) => {
    let picId = req.query.pictid;
    Picture.findById(picId, (err, data) => {
        if (err) throw err.message;
        res.json(data);
    });
}

// user sign-UP form
exports.signup = (req, res) => {
    // let password=req.query.password;

    res.render('signup', {
        errorMSG: req.flash('errorMSG'),
        errors: req.flash('errors')
    });
}

// checkPass
exports.checkPass = (req, res) => {
    const result = validationResult(req);
    let errors = result.array()
        // console.log(errors)
    res.json(errors);
}

// save/create a user account
exports.createUser = (req, res) => {
    const result = validationResult(req);
    let errors = result.array()

    if (errors.length != 0) {
        // console.log(errors)
        req.flash('errors', errors)
            // res.json(errors);
        res.redirect('/user/create')
    } else {
        let userInfo = req.body;
        let salt = bcrypt.genSaltSync(saltRound)
        let hashedPassword = bcrypt.hashSync(userInfo.password, salt)


        let newUser = new User({
            name: {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                middleName: userInfo.middleName
            },
            password: hashedPassword,
            email: userInfo.email,
            country: userInfo.country,
            country_code: userInfo.country_code,
            age: userInfo.age,
            // profilePic: req.file,
            gender: userInfo.gender,
            role: userInfo.role,
            address: {
                street: userInfo.street,
                hous_no: userInfo.hous_no,
                zip: userInfo.zip,
                city: userInfo.city
            }
        });
        newUser.save(err => {
            if (err) {
                // console.log(err.message)
                req.flash('errorMSG', 'You already have Account!')
                res.redirect('/user/create');
            } else {
                req.flash('successMSG', 'Your Account has been Created!')
                res.redirect('/user/jwt/login');
            }
        })
    }
}

// update user data
exports.updateUser = (req, res) => {
    res.send('updated user')
}

// user logout
exports.logout = (req, res) => {
        // delete req.session.thisUser;
        delete req.session.token;
        delete req.user;
        delete req.session.user;
        // console.log(req.user)
        res.redirect('/user/jwt/login')
    }
    // login jwt test
exports.jwtLogin = (req, res) => {
    res.render('jwtlogin', { successMSG: req.flash('successMSG'), errorMSG: req.flash('errorMSG') })
}

exports.jwtUserlogin = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        // console.log(user)
        if (err) throw err;
        // res.json(user)
        if (user == null) {
            req.flash('errorMSG', 'Wrong Email or Password');
            res.redirect('/user/jwt/login');
        } else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                    // console.log(result);
                    if (result) {
                        const payload = {
                            id: user._id
                        };
                        req.session.user = payload;
                        const token = jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' });
                        req.session.token = token;
                        req.flash('seccessMSG', user.fullName + ' is succesfully login');
                        res.redirect('/user/profile');
                    } else {
                        req.flash('errorMSG', 'Wrong Email or Password');
                        res.redirect('/user/jwt/login');
                    }
                })
                // const token = jwt.sign(req.body, accessTokenSecret);

        }
    })
}

// userorder
exports.getOrder = (req, res) => {

    res.render('order', { user: req.userId })
}
exports.authenticateJwt = (req, res, next) => {
    let token = req.session.token
    if (token) {
        //console.log(token);
        //  verify token and user
        jwt.verify(token, accessTokenSecret, (err, payload) => {
            if (err) throw err.message;
            req.userId = payload.id;
            console.log(req.userId)
        })
        next();
    } else {
        res.redirect('/jwt/login');
    }
}

exports.order = (req, res) => {
    res.json('your Order')
}

// facebook login


exports.loginFacebook = (req, res) => {
    res.json('facebook contact');
}

exports.getToken = (payload, req) => {
        const token = jwt.sign(payload, accessTokenSecret);
        req.session.token = token;
        //console.log(token);
        return token;
    }
    // test faker
exports.fakeTest = (req, res) => {
    let card = faker.helpers.createCard();
    card.image = faker.image.avatar();
    // console.log(card)
    res.render('fakeProfile', { card });
}

// creat faceAcc
let salt = bcrypt.genSaltSync(saltRound)
exports.fakeAcc = (req, res) => {
    let newUser = new User({
        name: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            middleName: faker.name.lastName()
        },
        password: bcrypt.hashSync('123', salt),
        email: faker.internet.email(),
        country: faker.address.country(),
        // country_code: faker.address.zipCodeByState(),
        age: faker.random.number(70),
        // profilePic: req.file,


        address: {
            street: faker.address.streetAddress(),
            zip: (faker.address.zipCode()).split('-')[0],
            city: faker.address.city()
        }
    });
    newUser.save(err => {
        if (err) {
            console.log(err.message)
            req.flash('errorMSG', 'You already have Account!')
            res.redirect('/user/fakeAcc');
        } else {
            req.flash('successMSG', 'Your Account has been Created!')
            res.redirect('/user/loginfake');
        }
    })

}

exports.jwtLoginFake = (req, res) => {
        res.render('jwtloginfake', { successMSG: req.flash('successMSG'), errorMSG: req.flash('errorMSG') })
    }
    // post fakelogin
exports.jwtUserloginFake = (req, res) => {
        User.findOne({ email: req.body.email }, (err, user) => {
            // console.log(user)
            if (err) throw err;
            // res.json(user)
            if (user == null) {
                req.flash('errorMSG', 'Wrong Email or Password');
                res.redirect('/user/loginfake');
            } else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                        // console.log(result);
                        if (result) {
                            const payload = {
                                id: user._id
                            };
                            req.session.user = payload;
                            const token = jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' });
                            req.session.token = token;
                            req.flash('seccessMSG', user.fullName + ' is succesfully login');
                            res.redirect('/user/profilefake');
                        } else {
                            req.flash('errorMSG', 'Wrong Email or Password');
                            res.redirect('/user/loginfake');
                        }
                    })
                    // const token = jwt.sign(req.body, accessTokenSecret);

            }
        })
    }
    // fake profile
exports.getProfilefake = (req, res) => {
    User.findById(req.session.user.id, (err, user) => {
        if (err) throw err;
        res.render('profileFake', { seccessMSG: req.flash('seccessMSG'), user });
    })

    // } else
    //     res.render('profile', { seccessMSG: req.flash('seccessMSG'), user: req.session.thisUser });

}

// searching a user test
exports.getUserByEmail = (req, res) => {
    let search = req.body.cSearch;
    User.aggregate([{
        $match: {
            $or: [
                { 'name.firstName': search },
                { email: search },
                { age: { $gte: Number(search) } },
            ]

        }
    }]).lookup({
        from: "pictures",
        localField: "profilePic",
        foreignField: "_id",
        as: "pic"
    }).exec((err, user) => {
        if (err) throw err;
        res.render('index', { user })
    });
}

// user search 

exports.getUserBy = (req, res) => {
    function checkError(user) {
        if (user.length == 0)
            req.flash('errorMSG', 'no user found');
        res.render('index', { user, errorMSG: req.flash('errorMSG') })

    }
    let serchBy = req.body.serchBy;
    let search;
    if (req.body.cSearch) { search = req.body.cSearch; }

    switch (serchBy) {
        case "ageGte":
            User.aggregate([{
                $match: { age: { $gte: Number(search) } }
            }]).exec((err, user) => {
                if (err) throw err;
                console.log(user);
                checkError(user);
            });
            break;
        case "ageLt":
            User.aggregate([{
                $match: { age: { $lt: Number(search) } }
            }]).exec((err, user) => {
                if (err) throw err;
                checkError(user);
            });
            break;
        case "country":
            User.aggregate([{
                $match: { country: search }
            }]).exec((err, user) => {
                if (err) throw err;
                checkError(user);
            });
            break;
        case "countryAGt":
            User.aggregate([{
                $match: {
                    $and: [
                        { country: req.body.cSearchC },
                        { age: { $gt: Number(req.body.cSearchA) } },
                    ]
                }
            }]).exec((err, user) => {
                if (err) throw err;
                checkError(user);
            });
            break;
        case "countryOGt":
            User.aggregate([{
                $match: {
                    $or: [
                        { country: req.body.cSearchC },
                        { age: { $gt: Number(req.body.cSearchA) } },
                    ]
                }
            }]).exec((err, user) => {
                if (err) throw err;
                checkError(user);
            });
            break;
        case "totalEge":
            User.aggregate([{
                $group: {
                    _id: null,
                    agesTotal: { $sum: "$age" }
                }
            }]).exec((err, sum) => {
                if (err) throw err;
                console.log(sum);
                res.render('index', { totalAge: sum[0].agesTotal })
            });
        case "AverageAge":
            User.aggregate([{
                $group: {
                    _id: null,
                    agesAvg: { $avg: "$age" }
                }
            }]).exec((err, avg) => {
                if (err) throw err;
                console.log(avg);
                res.render('index', { totalAge: avg[0].agesAvg })
            });
            break;
        case "countryOGt":
            User.aggregate([{
                $match: {
                    $and: [
                        { country: search },
                        { age: { $gt: Number(search) } },
                    ]
                }
            }]).exec((err, user) => {
                if (err) throw err;
                console.log(user);
                checkError(user);
            });
            break;
        default:
            User.aggregate([{

                $match: {
                    $or: [
                        { 'name.firstName': search },
                        { email: search },
                        { age: { $eq: Number(search) } },
                    ]
                }
            }]).exec((err, user) => {
                if (err) throw err;
                console.log(user);
                checkError(user);
            });
            break;
    }
};