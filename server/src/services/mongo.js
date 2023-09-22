const mongoose = require('mongoose')
require('dotenv').config();

const uri = process.env.MONGO_URL;

mongoose.connection.on('open', ()=>{
    console.log("Running")
})

mongoose.connection.on('error', (err)=>{
    console.error(err);
})

async function  mongoConnect(){
    await mongoose.connect(uri);
}

async function  mongoDiconnect(){
    await mongoose.disconnect();
}

module.exports= {
    mongoConnect,
    mongoDiconnect
}