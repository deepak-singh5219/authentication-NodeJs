
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(express.json());

app.get('/', (req,res) => {
    res.send('on home route');
})

app.post('/register', async (req,res) => {

    try {
        
        const {firstName, lastName, email, password} = req.body();

        if(!(firstName && lastName && email && password)){
            console.log('All fields are required!');
            res.status(400).send('Missing Information');
        }
    
        const existUser = User.findOne({email});
        if(existUser){
            res.status(401).send('User already exists');
        }
    
        const salt = await bcrypt.genSalt(10);
        const myEncrypPassword = await bcrypt.hash(password,salt);
    
        const user = await User.create({
            firstName,
            lastName,
            email, 
            password:myEncrypPassword
        });
    
        // create a token and send it to user
    
        const token = jwt.sign(
            {
                id:user._id,
                email:user.email,
            },
            "shhhhh",
            {  expiresIn: "2h" }
        );
    
        user.token = token;
        // don't want to send the password
        user.password = undefined;
    
        res.status(201).json(user);
    

    } catch (error) {
        console.log(error);
    }
 
})