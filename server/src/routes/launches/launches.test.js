const request = require('supertest');
const app = require("../../app.js");
const {mongoConnect, mongoDiconnect}= require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model.js');


describe('Launches API', ()=>{

    beforeAll(async ()=>{
        await mongoConnect();
        await loadPlanetsData();
    })

    afterAll(async ()=>{
        await mongoDiconnect();
    })

    describe('Test GET /launches', ()=>{
        test('It should respond with 200', async ()=>{
            const response= await request(app)
                            .get('/v1/launches')
                            .expect(200)
                            .expect('Content-Type', /json/ );
            
            //expect(response.statusCode).toBe(200);
        })
    })
    
    describe('Test POST /lauch', ()=>{
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'Rocket Sam',
            target: 'Kepler-62 f',
            launchDate:'January 4, 2030'
        }
    
        const lauchDataWithNoDate ={
            mission: 'USS Enterprise',
            rocket: 'Rocket Sam',
            target: 'Kepler-62 f',
        }
    
    
        const lauchDataWithInvalidDate ={
            mission: 'USS Enterprise',
            rocket: 'Rocket Sam',
            target: 'Kepler-62 f',
            launchDate:'zoot'
    
        }
    
        test('It should respond with 200 success', async ()=>{
            const response = await request(app)
                                  .post('/v1/launches')
                                  .send(completeLaunchData)
                                  .expect(201)
                                  .expect('Content-Type', /json/ );
            
                const requestDate= new Date(completeLaunchData.launchDate).valueOf();
                const responseDate= new Date(response.body.launchDate).valueOf();
                expect(responseDate).toBe(requestDate)
                expect(response.body).toMatchObject(lauchDataWithNoDate)
    
        })
    
        test('It should catch missing required properties', async ()=>{
            
                const response = await request(app)
                .post('/v1/launches')
                .send(lauchDataWithNoDate)
                .expect(400)
    
            expect(response.body).toStrictEqual({error:"Missing properties"})
    
        })
    
        test('It should catch invalid tests',async ()=>{
            
            const response = await request(app)
            .post('/v1/launches')
            .send(lauchDataWithInvalidDate)
            .expect(400)
    
        expect(response.body).toStrictEqual({error:"Bad Date"}) })
    })
    
})