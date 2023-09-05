 const launches = new Map()
 
 let latestFlightNumber= 100;

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

launches.set(launch.flightNumber, launch);


function existsLaunchByID(launchNumber){
    return launches.has(launchNumber)
}

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLauch(launch) {
    latestFlightNumber++;
    launch.flightNumber=latestFlightNumber;
    launches.set(latestFlightNumber, 
        Object.assign(launch,
            
            {
                success: true,
                upcoming: true,
                customers: ['Ruffo', 'NASA'],
                flightNumber: latestFlightNumber,
            }
            ));
}

function deleteLaunchById(launchNumber){
    const aborted= launches.get(launchNumber);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
    
}

module.exports = {
    getAllLaunches,
    addNewLauch,
    existsLaunchByID,
    deleteLaunchById
}