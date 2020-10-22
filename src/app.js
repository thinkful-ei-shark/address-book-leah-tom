require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const { v4: uuid } = require('uuid');

const app = express();


const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json())

const contact = [
    {
        id: uuid(),
        "firstName": "String",
        "lastName": "String",
        "address1": "String",
        "address2": "String",
        "city": "String",
        "state": "String",
        "zip": "Number"
    },

    {
        id: uuid(),
        "firstName": "Tom",
        "lastName": "Wallace",
        "address1": "Home",
        "address2": "Boo",
        "city": "Foo",
        "state": "String",
        "zip": "Number"
    }
];

app.get('/address', (req, res) => {
    res.send(contact);
});

app.post('/address', (req, res) => {
    const requiredKeys = ["firstName", "lastName", "address1", "city", "state", "zip"]
    //const { firstName, lastName, address1, address2 = false, city, state, zip } = req.body;
    const optionalKeys = ["address2"]

    let contact = {}
    for (let i = 0; i < requiredKeys.length; i++) {
        const key = requiredKeys[i]
        if (!req.body[key]) {
            return res.status(400).send(`${key} required!`)
        }
        contact[key] = req.body[key]
    }

    for (let i = 0; i < optionalKeys.length; i++) {
        const key = optionalKeys[i]
        if (req.body[key]) {
            contact[key] = req.body[key]
        }
    }


    if (contact.state.length >= 3) {
        return res
            .status(400)
            .send('State must be exactly two characters!')
    }

    if (contact.zip.length !== 5) {
        return res
            .status(400)
            .send('Zip must be exaclty 5 digits!')
    }



    console.log(contact)
    // if (!firstName) {
    //     return res
    //         .status(400)
    //         .send('First Name required!')
    // }

    // if (!lastName) {
    //     return res
    //         .status(400)
    //         .send('Last Name required!')
    // }

    // if (!address1) {
    //     return res
    //         .status(400)
    //         .send('Address required!')
    // }

    // if (!city) {
    //     return res
    //         .status(400)
    //         .send('City required!')
    // }

    // if (!state) {
    //     return res
    //         .status(400)
    //         .send('State is required!')
    // }



    // if (!zip) {
    //     return res
    //         .status(400)
    //         .send('Zip is required!')
    // }



    return res.status(201).send(contact)


})


app.use(function errorHandler(error, req, res, next) {
    let response;
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});

module.exports = app;