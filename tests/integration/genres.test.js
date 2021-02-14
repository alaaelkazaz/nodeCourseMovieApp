const request=require('supertest');
const { Genre } = require('../../models/genres');
const mongoose = require('mongoose');
const { User } = require('../../models/users');
let server;
describe('/api/genres',()=>{
    beforeEach(()=>{server = require('../../index');});
    afterEach(async ()=>{ 
    await server.close();
    await Genre.deleteMany({});
    });

    afterAll(async ()=>{});

    describe('GET /', ()=>{
        it('should return all genres ',async ()=>{
            await Genre.collection.insertMany([
                    {name: "genre1"},
                    {name:"Fantasy"}
                ]);
            const res = await  request(server).get('/api/genres')
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(2)
          expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
        });
    });

    describe('Get:/id ', ()=>{
        it('should return the given genre if valid id ',async ()=>{
            const genre = new Genre({name:"genre1"});
            await genre.save();
            const res = await  request(server).get('/api/genres/'+ genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',"genre1"); 
            expect(res.body).toHaveProperty("_id",genre._id.toHexString()); 
        });
        it('should return 404 genre if not valid id ',async ()=>{

            const res = await  request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404);
        });
        it('should return 404 for genre that doesnot match any genre ',async ()=>{

            const res = await  request(server).get(`/api/genres/${new mongoose.Types.ObjectId()}`);
            expect(res.status).toBe(404);
        });
    });

    describe('Post',()=>{
        let token ;
        let name ;
        
        beforeEach(()=>{
            name = 'genre1';
            token = User.generateAuthToken();
        });

        const exec =() =>{
            return request(server)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name})
        };
        it('should return 401 if user is not logged in ',async ()=>{
           token ='';
           const res = await exec();  
           expect(res.status).toBe(401);
        });

        it('should return 400 if user name is les than 3 chars ',async ()=>{
            name='12';
            const res = await exec(); 
            expect(res.status).toBe(400);
         });
    });

});