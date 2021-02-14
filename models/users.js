const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('config');

// validate 
function validateUser(user){
const userScem = {
    name: Joi.string().min(3).max(250).required(),
    email: Joi.string().required().min(10).max(250).email(),
    password:Joi.string().min(8).max(1024).required()
}
return Joi.validate(user, userScem);
};
// create the schema 
const userSchema =new mongoose.Schema({
    name:{
        type: String,
        minlength: 3,
        maxlength: 250,
        required: true
    },
    email:{
        type: String,
        unique: true,
        minlength:10,
        maxlength:250,
        required: true
    },
    password:{
        type:String, 
        minlength: 8,
        maxlength:1024,
        required:true 
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign(
        _.pick(this, ["_id","isAdmin"]),
        config.get("jwtPrivateKey")
    );
};
// model the schema 
function getUserModel(){
    return mongoose.model('User',userSchema);
};
const User = getUserModel();

// export 
module.exports.User = User;
module.exports.validate = validateUser;