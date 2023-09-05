const {
    getAllLaunches,
    addNewLauch,
    existsLaunchByID,
    deleteLaunchById
} = require('../../models/launches.model')

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpPostLaunch(req, res) {
    const launch = req.body;
    if(!launch.mission||!launch.rocket||
        !launch.launchDate||!launch.target)
        {
            return res.status(400).json({error:"Missing properties"})

        }

    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate))
    {
        return res.status(400).json({error:"Bad Date"})

    }
    addNewLauch(req.body)
    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res){
    const launchId= Number(req.params.id);
    if(!existsLaunchByID(launchId))
    {
        return res.status(404).json({
            error: "Launch not found"
        })
    }
    else{

        const aborted = deleteLaunchById(launchId)
        return res.status(200).json(aborted)
    }
}

module.exports = {
    httpGetAllLaunches,
    httpPostLaunch,
    httpAbortLaunch
}
