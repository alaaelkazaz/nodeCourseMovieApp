const express =require('express');
const router = express.Router();
const mongoose= require('mongoose');
const Joi=require('joi');
const Fawn = require('fawn');
const { Movie } = require('../models/movies');
const { Customer }= require('../models/customers');
const {Rental , validate } = require('../models/rentals');


Fawn.init(mongoose);
router.get('/',async (req,res)=>{
    const rentals = Rental.find()
    res.send(rentals);
});
/*
router.get('/:id',async (req, res)=>{
    const rent = await Rental.findById(req.params.id);
    if (!rent) res.status(404).send("We don't have this movie rental....");
    res.send(rent);
});
*/

router.post('/',async(req, res)=>{
    //validate first ya amaaaar 
    const result = validate(req.body);
    if (result.error){
        return  res.status(400).send('Bad request not vaild movie rental ...');
    }

    const customer= await Customer.findById(req.body.customerId);
    if (!customer) res.status(400).send('Invalid Customer ...');

    const movie= await Movie.findById(req.body.movieId);
    if (!movie) res.status(400).send('Invalid Movie ...');

    if (movie.numberInStock === 0) return res.status(400).send('Movie is sold out ...');
    let rent= new Rental({
        customer:{
            _id: customer._id,
            name: customer.name, 
            phone: customer.phone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRenatlRate: movie.dailyRenatlRate
        }
    });

    try {
        
        new Fawn.Task()
        .save('rentals',rent)
        .update('movies',{ _id: movie._id }, {
            $inc:{numberInStock:-1}
        })
        .run();
    } catch (error) {
        res.status(500).send('Something failed ....');
    }

    res.send(rent); 
});

router.put('/:id',async (req, res)=>{
     //validate first ya amaaaar 
     const result = validate(req.body);
     if (result.error){
         res.status(400).send('Bad request not vaild movie ...');
         return 
     }
    const genre= await Genre.findById(req.body.genreId);
    if (!genre) res.status(404).send('Invalid Genre ...');
    const rent = await Rental.findByIdAndUpdate(req.params.id,
         {
             // here schema 
         } , {new: true})
    if (!rent)res.status(400).send('Bad Request of a Movie Renal ')
    send.res(rent);
});

router.delete('/:id', async (req, res)=>{
    const delRent = await Movie.findByIdAndRemove(req.params.id);
    if (! delRent) res.status(404).send('Not Existant Movie to delete...');
    res.send(delRent);
});










module.exports = router;