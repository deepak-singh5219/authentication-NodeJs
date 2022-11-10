const mongoose = require('mongoose');

const MDB_URL = "mongodb://127.0.0.1:27017/auth";

exports.connect = () => {
    mongoose.connect(MDB_URL,{
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

