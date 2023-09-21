 const launchesDB = require('./launches.mongo')
 const planets = require('./planets.mongo')
 
 const launches = new Map()
 const DEFAULT_NUMBER= 100;

 const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate:  new Date(2033, 11, 27),
    target: 'Kepler-442 b',
    customers: ['Sam', 'Nasa'],
    upcoming: true,
    success:true
    }

saveLaunch(launch);

async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target
    })
    if(!planet){
        throw new Error('No mathces')
    }

    await launchesDB.findOneAndUpdate(
        { flightNumber: launch.flightNumber }, // Condition
        launch, // Object with changes (using $set to update specific fields)
        { upsert: true } // Options: create if not found
      );
}

async function existsLaunchByID(launchNumber){

    const launchWithID= await launchesDB.
        findOne({flightNumber:launchNumber})
    return launchWithID!=null;
}

async function getLatestFlightNumber(){
    const latestLaunch= await launchesDB
    .findOne()
    .sort('-flightNumber');
    return latestLaunch? latestLaunch.flightNumber:DEFAULT_NUMBER;
}

async function getAllLaunches(){
    return  await launchesDB
    .find({}, {'_id':0, '__v':0})
}

async function scheduleNewLaunch(launch)
{
    const newlatestLuanchNumber= await getLatestFlightNumber()+1;
    const newLaunch= Object.assign(launch,
        {
            success: true,
            upcoming: true,
            customers: ['Ruffo', 'NASA'],
            flightNumber: newlatestLuanchNumber,
        });

    await saveLaunch(newLaunch);
}



async function deleteLaunchById(launchNumber){
    const aborted= await launchesDB
        .updateOne({flightNumber:launchNumber}, {
            upcoming:false,
            success:false
        });
        return aborted.modifiedCount === 1;
    }

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchByID,
    deleteLaunchById
}