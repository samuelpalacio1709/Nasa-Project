const express = require('express');
const path = require('path')
const cors = require('cors');
const morgan = require('morgan')
const api = require('./routes/api')

const app = express();


app.use(cors({origin:'http://localhost:3000'}));
app.use(morgan('combined'))
app.use(express.json()); // Middleware to procces data as JSON

app.use('/v1', api)
app.use(express.static(path.join(__dirname,'..','public')))
app.get('/*', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
} )

module.exports = app;