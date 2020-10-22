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

const contacts = [
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
    res.send(contacts);
});

app.post('/address', (req, res) => {
    const requiredKeys = ["firstName", "lastName", "address1", "city", "state", "zip"]
    const { firstName, lastName, address1, address2 = false, city, state, zip } = req.body;
    const optionalKeys = ["address2"]

    for (let i = 0; i < requiredKeys.length; i++) {
        const key = requiredKeys[i]
        if (!req.body[key]) {
            return res.status(400).send(`${key} required!`)
        }
        contacts[key] = req.body[key]
    }

    for (let i = 0; i < optionalKeys.length; i++) {
        const key = optionalKeys[i]
        if (req.body[key]) {
            contacts[key] = req.body[key]
        }
    }


    if (contacts.state.length >= 3) {
        return res
            .status(400)
            .send('State must be exactly two characters!')
    }

    if (contacts.zip.length !== 5) {
        return res
            .status(400)
            .send('Zip must be exaclty 5 digits!')
    }

    const id = uuid();
    const newContact = {
        id,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zip
    }

    contacts.push(newContact);

    return res
            .status(201)
            .location(`http://localhost:8000/address/${id}`)
            .json(newContact)
})

app.delete('/address/:id', (req, res) => {
    
    const { id } = req.params;
    

    const index = contacts.findIndex(contact => contact.id === id);

    if (index === -1) {
        return res
          .status(404)
          .send('User not found');
      }
      
    contacts.splice(index, 1);
    
    res
      .status(404)
      .end();

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