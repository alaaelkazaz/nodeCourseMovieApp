const Joi = require('joi');
const mongoose = require('mongoose');
// to validate that the ids are valid in mongo format 
Joi.objectId = require('joi-objectid')(Joi);
const moment = require('moment');
// use the Joi-objectId lib here 
function validateRental(rental){
    const rentschema = {
        customerId:Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(rental, rentschema);
};

const rentalSchema = mongoose.Schema({
        customer:{
            type: new mongoose.Schema({
                name:{
                    type:String,
                    minlength:3,
                    maxlength:250,
                    required:true
                },
                isGold:{
                    type:Boolean,
                    default:false
                },
                phone:{
                    type:String,
                    minlength:5,
                    maxlength:25,
                    required:true
                }
            }),
            required:true
        },
        movie:{
            type: new mongoose.Schema({
            title: {
                    type: String,
                    minlength:3,
                    maxlength:250,
                    required:true
                },
            dailyRenatlRate:{
                    type:Number,
                    min:0,
                    max:250,
                    required:true
                }
            
            }),
            required:true
        },
        dateOut:{
            type:Date,
            required:true,
            default:Date.now
        },
        dateReturned:{
            type:Date
        },
        rentalFee:{
            type:Number,
            min:0
        }
    });

rentalSchema.statics.lookup = function(customerId, movieId){
    return this.findOne({
        'customer._id':customerId,
        'movie._id': movieId
    });
};
rentalSchema.methods.return= function(){
    rental.dateReturned=new Date();
    
    const  rentaldays =moment().diff(this.dateOut,'days');
    rental.rentalFee= rentaldays * this.dailyRentalRate;
};
const Rental = mongoose.model('Rental',rentalSchema);

module.exports.Rental =Rental;
module.exports.validate= validateRental;