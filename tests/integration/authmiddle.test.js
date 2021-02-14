const { User } = require('../../models/users');
const request = require('supertest');
const { Genre } = require('../../models/genres');
describe('testing auth middleware',()=>{
    let server;
    let token ;
    beforeEach(()=>{
        server= require('../../index');
        token = new User().generateAuthToken();

    });

    afterEach(()=>{
        await server.close();
        await Genre.remove({});

    });
    const exec = () =>{
       return request(server)
       .post('api/genres')
       .set('x-auth-token',token)
       .send({name:'genre1'})  
    };
    it('should return 401 if no token is provided..',async ()=>{
        token =' ';
        await exec();
        expect(res.status).toBe(401);
    });
    it('should return 400 if token is Invalid...',async ()=>{
        token = 'a'
        await exec();
        expect(res.status).toBe(400);
    });
    it('should return 400 if token is Invalid...',async ()=>{
        await exec();
        expect(res.status).toBe(200);
    });
});