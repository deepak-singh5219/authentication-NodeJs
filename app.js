require('dotenv').config();
require('./config/db').connect();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const auth = require('./middleware/auth');
app.use(express.json());
app.use(cookieParser());


app.get("/", (req,res)=>{
    res.send("<h1>Home Route</h1>")
})

// register route
app.post('/register', async (req,res) => {

    try {
        
        // fetching data 
        const {firstName, lastName, email, password} = req.body;

         // validating data
        if(!(firstName && lastName && email && password)){
            
            res.status(400).json({
                "message":"insufficient data"
            });
        }
    
        // checking if user already exists
        const existUser = await User.findOne({email});
        if(existUser){
            res.status(401).json({
                email,
                "message":"already exist"
            })
        }
        
        // encrypting the password
        const salt = await bcrypt.genSalt(10);
        const myEncrypPassword = await bcrypt.hash(password,salt);
    
        // creating user in database
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
 
});

// login route
app.post('/login', async(req,res) => {

    try {
        const {email, password} = req.body;

        if(!(email && password)){
            res.status('401').json({
                "message":"insufficient data"
            });
        }

        const user = await User.findOne({email});
        if(!user){
            res.status(401).json({"message":"does not exist"});
        }

        // matching the password

        if(user && (await bcrypt.compare(password,user.password))){
            // credentials are correct and thus logging in user
            const token = jwt.sign({
                id:user._id,
                email
            }, 'shhhhh', 
            {
                expiresIn: "2h"
            }
            );

            user.password  = undefined;
            user.token = token;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000 ),
                httpOnly:true,
            }

            res.status(200).cookie("token", token, options).json({
                success: true,
                user
            });
            
        }

        res.status(401).json({
            "message":"invalid credentials"
        });

    } catch (error) {
      console.log(error);
    }

})

// dashboard
app.get('/dashboard', auth, async(req,res) => {
    res.status(200).json({
        "message":"Welcome to Dashboard",
        "user": req.user
    });

})

app.get('/profile', auth, async(req,res) => {
    // extracting email of logged in user
    const {email} = req.user;
    // finding user in database
    const user = await User.findOne({email});
    user.password = undefined;
    res.status(200).json({
        "message":"User Profile",
        "userDetails":user
    })

})

module.exports = app;

