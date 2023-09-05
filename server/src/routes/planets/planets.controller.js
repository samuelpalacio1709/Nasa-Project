const {getAllPlanets} = require('../../models/planets.model')

function htttpGetAllPlanets(req, res) {
    return res.status(200).json(getAllPlanets());
}

module.exports = {
    htttpGetAllPlanets

}