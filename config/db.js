const mongoose = require('mongoose');

const MDB_URL = "";

exports.connect = () => {
    mongoose.connect(MDB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connection Succesfull'))
    .catch((err) => {
        console.log('MongoDb Connection Failed');
        console.log(err);
        process.exit(1);
    })
};

