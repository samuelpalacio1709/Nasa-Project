const http = require('http');
const app = require('./app')
const {mongoConnect} = require('./services/mongo')

const {loadPlanetsData} = require('./models/planets.model')

const server = http.createServer(app);//Use the bult-in http node module but add express to process the listening
const PORT = process.env.PORT || 8000;


async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    server.listen(PORT, ()=>{
        console.log(`Listening in port ${PORT}`)
    })
}

startServer();