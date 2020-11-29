const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const CoronaSale = require('./models/CoronaSaleModel');
// setup body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//setup mangoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:M0h@mmed@mohammad.v7aku.mongodb.net/test', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Your MongoDB is connected......')
    })
    .catch(err => console.log('Your ERROR is : ' + err));

// routs
app.post('/login', (req, res) => {
    // res.json(req.body)
    let userData = req.body;

    User.findOne({ user_email: userData.email }, (err, data) => {
        if (err) throw err;
        console.log(data)
        console.log(userData)
        if (data != null && userData.password == data.user_password) {
            let userLogin = data
            res.json(userLogin);


        } else {

            res.json('wrong info')
        }
    })
});

app.get('/coronaSale', (req, res) => {
    CoronaSale.find((err, coronaSale) => {
        if (err) throw err;
        res.json(coronaSale);
    })
});

app.get('/coronaSale/:city', (req, res) => {
    city = req.params.city.toLowerCase();

    // console.log(id)
    CoronaSale.find((err, stors) => {
        if (err) throw err;
        let searchStor = [];
        for (stor of stors) {
            if (stor.city == city) {
                searchStor.push(stor)
            }
        }
        if (searchStor == [null]) res.json('the city is not found');
        else res.json(searchStor);
    });

});
app.get('/coronaSale/:city/:area', (req, res) => {
    city = req.params.city.toLowerCase();
    area = req.params.area.toLowerCase();
    // console.log(id)

    CoronaSale.find((err, stors) => {
        if (err) throw err;
        let searchStor = [];
        for (stor of stors) {
            if (stor.city == city && stor.area == area) {
                searchStor.push(stor)
            }
        }
        if (searchStor == [null]) res.json('the city or area is not found');
        else res.json(searchStor);
    });
});

app.post('/sign', (req, res) => {
    // let userId = Math.floor(Math.random() * 100);
    userInfo = req.body;

    let newCoronaSale = new CoronaSale({
        shopName: "Rewe",
        toilet_tissue: "available",
        area: "neuköln",
        city: "berlin",
        rice: "available",
        sugar: "available",
        coronaPrecaution: "yes",
        card_use: "bankcard, amex, visa etc",
        cash: "available"
    });
    newCoronaSale.save(() => {
        // console.log(newUser._id)
        res.json('Created')
    });
});
app.listen(4500, (req, res) => {
    console.log('the server is running.....')
})