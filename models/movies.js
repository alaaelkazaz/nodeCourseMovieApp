const mongoose= require('mongoose');
const Joi=require('joi');
const { genreSchema } = require('./genres');

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(3).max(250).required(),
        genreId:Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(250).required(),
        dailyRenatlRate: Joi.number().min(0).max(250).required()
    };
    return Joi.validate(movie, schema);
};

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        minlength:3,
        maxlength:250,
        required:true
    },
    genre:{
    //embedding the genre object 
       type:genreSchema,
       required: true
    },
    numberInStock:{
         type: Number, 
         min:0,
         max:250,
         required:true   },
    dailyRenatlRate:{
        type:Number,
        min:0,
        max:250,
        required:true
    }
});
  const Movie = mongoose.model('Movie', movieSchema);


  module.exports.Movie = Movie;
  module.exports.validate =validateMovie;

