 const launchesDB = require('./launches.mongo')
 const planets = require('./planets.mongo')
 const axios = require('axios')


 const DEFAULT_NUMBER= 100;


async function saveLaunch(launch){
  
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

async function getAllLaunches(skip, limit){
    return  await launchesDB
    .find({}, {'_id':0, '__v':0})
    .sort({flightNumber:1})
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(launch)
{

    const planet = await planets.findOne({
        keplerName: launch.target
    })
    if(!planet){
        throw new Error('No mathing planet found')
    }

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

async function findLaunch(filter)
{
    return await launchesDB.findOne(filter);
}

async function populateFunction(){
    const SPACEX_API_URL= 'https://api.spacexdata.com/v4/launches/query';
    const query = {
        query: {},
        options:{
            pagination:false,
            populate :[
                {
                    path: 'rocket',
                    select :{
                        name:1
                    }
                },
                {
                    path: 'payloads',
                    select :{
                        'customers':1
                    }
                }
            ]
        }
    }

    const response= await axios.post(SPACEX_API_URL, query);

    if(response.status!==200){
        console.log("Problem");
        throw new Error("Failed");
    }
    const launchDocs= response.data.docs;

    for(const launchDoc of launchDocs )
    {
        const payloads = launchDoc['payloads'];
        const customers= payloads.flatMap((payload)=> {
            return payload['customers']
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        }
        await saveLaunch(launch)
    }
}

async function loadLaunchData(){
    const firstLaunch= await findLaunch({
        flightNumber:1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    if(firstLaunch){
        console.log(`First Launch ${firstLaunch} is already loaded!` )
        return;
    }

    await populateFunction();
}


module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchByID,
    deleteLaunchById,
    loadLaunchData
}