const jwt = require('jsonwebtoken');
const config = require('config');
const { User }= require('../models/users');
const Joi=require('joi');
const mongoose= require('mongoose');
const express =require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// custom validate function for login user 
function validate(req){
    const userScem = {
        email: Joi.string().required().min(10).max(250).email(),
        password:Joi.string().min(8).max(1024).required()
    }
    return Joi.validate(req, userScem);
};


router.get('/',async (req, res)=>{
    const users =await User.find()
    res.send(users);
});

router.post('/', async (req, res)=>{
    
    const {error} = validate(req.body);

    if(error){
        return  res.status(400).send(error.details[0].message);
    };
    
    // deprication problem because of the versions try to splve later
    // before production and uncomment the comming 2 lines 
    
    // make sure that this user is not already registered 
    // using email prop 
    let user=await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('Invalid email or password...');
    // validate the password 
   const validPass =await bcrypt.compare(req.body.password , user.password);
   if(!validPass)return res.status(400).send('Invalid email or password...');
   const token = jwt.sign({_id:user._id},config.get('jwtPrivateKey'));
   res.send(token);

});


module.exports =router;