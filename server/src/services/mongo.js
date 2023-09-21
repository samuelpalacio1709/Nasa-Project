const mongoose = require('mongoose')

const password = "eOnD72tS0UtxjNAo"; 
const uri = `mongodb+srv://nasa-api:${password}@clustersam.uydehtq.mongodb.net/nasa?retryWrites=true&w=majority`;


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