
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./model/user');
const bcrypt = require('bcryptjs');

app.use(express.json());

app.get('/', (req,res) => {
    res.send('on home route');
})

app.post('/register', async (req,res) => {
    const {firstName, lastName, email, password} = req.body();

    if(!(firstName && lastName && email && password)){
        console.log('All fields are required!');
        res.status(400).send('Missing Information');
    }

    const existUser = User.findOne({email});
    if(existUser){
        res.status(400).send('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const myEncrypPassword = await bcrypt.hash(password,salt);

    const user = {
        firstName,
        lastName,
        email, 
        password:myEncrypPassword
    };
  
})