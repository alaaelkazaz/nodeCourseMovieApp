const express =require('express');
const router = express.Router();
const mongoose= require('mongoose');
const Joi=require('joi');
const { User, validate } = require('../models/users');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/', async (req, res)=>{
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
    let user= await User.findOne({email: req.body.email})
    if (user) return res.status(400).send('Already registered User');
    /*user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });*/
    const salt = await  bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    // another implementation usig lodash 
    user = new User(_.pick(req.body, ['name', 'email', 'password' ]));
   await user.save();
    const jwtToken  = jwt.sign({_id: user._id},config.get('jwtPrivateKey')); 
    res.send(user);
    res.header('x-auth-jwt',jwtToken).send( _.pick(user, ['_id', 'name', 'email']));
});


module.exports = router;