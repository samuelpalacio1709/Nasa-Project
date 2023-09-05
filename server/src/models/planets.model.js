const { rejects } = require('assert');
const { parse } = require('csv-parse');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path')

const habitablePlanets = [];


 function loadPlanetsData(){
    return new Promise((resolve, reject)=> {


        fs.createReadStream(path.join(__dirname, '..','..' , "data", "kepler_data.csv" ))
        .pipe(parse({
            comment: '#',
            columns: true
    
        }))
        .on('data', (data)=>{
            if(isHabitablePlanet(data))
            habitablePlanets.push(data);
        })
        .on('end', ()=>{
           habitablePlanets.map((planet) =>{
                return planet['kepoi_name'];
            });

            resolve();
        })
        .on('error', (error)=>{
            console.log(error);
            reject(error);
        })


    })
}

//The parse function doesnt read the file itself




function isHabitablePlanet(planet){
    return planet['koi_disposition']==='CONFIRMED' 
    && planet['koi_insol']> 0.36 &&planet['koi_insol']<1.11
    && planet['koi_prad']< 1.6;

}

function getAllPlanets(){
    return habitablePlanets;
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}