const mongoose = require('mongoose');

const {MONGODB_URL} = process.env;

exports.connect = () => {
    mongoose.connect(MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB Connection Succesfull'))
    .catch((err) => {
        console.log('MongoDB Connection Failed');
        console.log(err.message);
        process.exit(1);
    })
};

