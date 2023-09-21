const {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchByID,
    deleteLaunchById
} = require('../../models/launches.model')

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpPostLaunch(req, res) {
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
    await scheduleNewLaunch(launch)
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res){
    const launchId= Number(req.params.id);
    const existsLaunch=await existsLaunchByID(launchId)
    if(!existsLaunch)
    {
        return res.status(404).json({
            error: "Launch not found"
        })
    }
    else{

        const aborted = await deleteLaunchById(launchId)
        if(!aborted){
            return res.status(400).json({err: 'Launch not aborted'})
        }
        else
        {
            return res.status(200).json({ok: true})

        }
    }
}

module.exports = {
    httpGetAllLaunches,
    httpPostLaunch,
    httpAbortLaunch
}
