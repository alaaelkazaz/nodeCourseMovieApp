const express = require('express');
const error = require('../middleware/error');
const log=require('../middleware/logger');
const register = require('../routes/register');
const login = require('../routes/login');
const rentals = require('../routes/rentals');
const movies = require('../routes/movies');
const customers = require('../routes/customers');
const genres=require('../routes/genres');
const home=require('../routes/home');
const returns = require('../routes/returns');


module.exports = function(app){
    
    //json middle ware to handle requests body 
    app.use(express.json())
    // routing to returns page 
    app.use('/api/returns',returns);
    // routing to /api/login
    app.use('/api/login',login);
    // routing to /api/register
    app.use('/api/register',register);
    // routing to /api/rentals
    app.use('/api/renatls',rentals);
    // routing to /api/movies
    app.use('/api/movies',movies);
    // routing to /api/genres
    app.use('/api/genres',genres);
    //routing to /api/customers
    app.use('/api/customers',customers);
    // routing to /
    app.use('/',home);
    // printing out 
    app.use(error);

};
