
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./model/user');
const bcrypt = require('bcryptjs');

app.use(express.json());


