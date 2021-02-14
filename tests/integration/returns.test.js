const mongoose = require('mongoose');
const request  = require('supertest');
const { Rental } = require('../../models/rentals');
const { Movie } = require('../../models/movies');
const { User } =require('../../models/users');
const moment = require('moment');
const { object } = require('joi');
describe('Post ',()=>{
    let server;
    let customerId;
    let movieId;
    let rental 
    let movie;
    beforeEach(()=> {
        server = require('../../index')
        token = User().generateAuthToken();
        customerId= mongoose.Types.ObjectId();
        movieId= mongoose.Types.ObjectId();
        rental = new Rental({
            customer:{
                _id:customerId,
                name: '12345',
                phone: '12345'
            },
            movie:{
                _id: movieId,
                title:'12345',
                dailyRenatlRate:2
            }
        });
        await rental.save();
        movie = new Movie({
            _id:movieId,
            title:'12345',
            dailyRenatlRate:2,
            genre:'12345',
            numberInStock:10
        });
        await movie.save();
    });
    afterEach(async()=>{
        await server.close()
        await Rental.remove({});
        await Movie.remove({});

    });

    const exec = () =>{
        return request(server)
        .post('/api/returns')
        .set("x-auth-token",token)
        .send({customerId: customerId, movieId:movieId});
    };



    it('it should work',async()=>{
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
     });

    it('it should send 401 if user is not logged in',async()=>{
     token ="";
     const res = await exec();
     expect(res.status).toBe(401);
    });

    it('should return 400 if customerID is not provided ',async()=>{
        customerId=''
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieID is not provided ',async()=>{
        movieId=''
        const res =await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental is there for  movieID/customer combination',async()=>{
        Rental.remove({});
        const res =await exec();
        expect(res.status).toBe(400);
    });


    it('should return 400 if rental is already processed',async()=>{
        rental.dateReturned = new Date();
        await rental.save();
        const res =await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a vaild request ! ',async()=>{
        const res =await exec();
        expect(res.status).toBe(200);
    });

    it('should set the returnDate if input valid ',async()=>{
        const res =await exec();
        const rentalInDb = Rental.findById(rental._id);
        const difference = new Date() - rentalInDb.dateReturned
        expect(difference).toBelessthan(10*5000);
    });

    it('should set the returnFee if input valid ',async()=>{
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save(); 
        const res =await exec();
        const rentalInDb = Rental.findById(rental._id);
        expect(rentalInDb.retalFee).toEqual(14);
    });
    
    it('should increase the movie stock if input valid ',async()=>{
        const movieInDb = Movie.findById(movieId);
        const res = await exec();
        expect(movieInDb.retalFee).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if input is valid ',async()=>{
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(Object.Keys(res.body)).toEqual(expect.arrayContaining(['dateOut','dateReturned','rentalFee','customer','movie']));
    });

});