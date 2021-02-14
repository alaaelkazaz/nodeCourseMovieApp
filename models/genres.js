const mongoose= require('mongoose');
const Joi=require('joi');
// validation of any genre input 
function validateGenre(genre){
    const schema={
        name:Joi.string().min(3).required()
    };

    return Joi.validate(genre,schema);
}

// making the schema 
const genreSchema =mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 70
     }
});

 // making a model
 const Genre = mongoose.model('Genre', genreSchema);

 // module interface 
 module.exports.genreSchema =genreSchema;
 module.exports.Genre= Genre;
 module.exports.validate =validateGenre;