const express = require('express');
const{httpGetAllLaunches, httpPostLaunch,httpAbortLaunch}= require('./launches.controller');

const launchesRouter= express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpPostLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;
