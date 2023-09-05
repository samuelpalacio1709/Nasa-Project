const express = require('express');
const {htttpGetAllPlanets} = require('./planets.controller')

const planetRouter= express.Router();

planetRouter.get('/', htttpGetAllPlanets);

module.exports = planetRouter;
