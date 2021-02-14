const express =require('express');
const auth =require('../middleware/auth');
const router = express.Router();
const mongoose= require('mongoose');
const Joi=require('joi');
const { Rental }= require('../models/rentals');
const moment = require('moment');
const { Movie }= require('../models/movies');
const validate = require('../middleware/validate');
function validateReturn(rental){
    const schema={
       customerId:Joi.objectId().required(),
       movieId: Joi.objectId().required()
    };

    return Joi.validate(rental,schema);
}

router.post('/', [auth, validate(validateReturn)],async (res, req)=>{
    //if(!req.body.customerId) return res.status(400).send('no customer id provided ');
    //if(!req.body.movieId) return res.status(400).send('no movie id provided ');
    // another better implementation for validation
    //const {error} = validateReturn(req.body); 
    //if(error) return res.status(400).send( error.details[0].message);
    const rental =await Rental.lookup(req.body.customerId, req.body.movieId);
    
    if (!rental) return res.status(404).send('Rental is not found');
    if (rental.dateReturned) return res.status(400).send('Rental is already returned...');
    rental.return();
    await rental.save();
    await Movie.updateOne({_id:rental.movie._id},{$inc:{numberInStock:1}
    });

    return res.status(200).send(rental);
});


module.exports = router;