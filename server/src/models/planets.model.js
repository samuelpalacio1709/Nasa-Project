const { rejects } = require('assert');
const { parse } = require('csv-parse');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path')
const planets = require('./planets.mongo')


 function loadPlanetsData(){
    return new Promise((resolve, reject)=> {


        fs.createReadStream(path.join(__dirname, '..','..' , "data", "kepler_data.csv" ))
        .pipe(parse({
            comment: '#',
            columns: true
    
        }))
        .on('data', async (data)=>{
            if(isHabitablePlanet(data))
            {
                savePlanet(data)
            }
            //habitablePlanets.push(data);
        })
        .on('end', async ()=>{
            const countPlanetsFound= (await getAllPlanets()).length;
            console.log((await getAllPlanets()));
            console.log(countPlanetsFound+" Planets have been found")
            resolve();
        })
        .on('error', (error)=>{
            console.log(error);
            reject(error);
        })


    })
}

function isHabitablePlanet(planet){
    return planet['koi_disposition']==='CONFIRMED' 
    && planet['koi_insol']> 0.36 &&planet['koi_insol']<1.11
    && planet['koi_prad']< 1.6;

}

async function getAllPlanets(){
    return await planets.find({},{
        '_id':0,'__v':0
    }); //Finds all planets
}

async function savePlanet(planet){
        try{
            const planetData= {keplerName : planet.keplerName}
            await planets.updateOne(planetData,planetData,{upsert:true}) //Upsert, update if existing, add if unexited
        }
        catch(err){
            console.error("Could not save Planet" +err)
        }

}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}