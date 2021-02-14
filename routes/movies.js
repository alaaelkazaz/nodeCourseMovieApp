const express =require('express');
const router = express.Router();
const mongoose= require('mongoose');
const Joi=require('joi');
const { Genre } = require('../models/genres');
const {Movie , validate } = require('../models/movies');


router.get('/', async(req,res)=>{
    const movies = await Movie.find()
    res.send(movies);
});

router.get('/:id',async (req, res)=>{
    const movie = await Movie.findById(req.params.id);
    if (!movie) res.status(404).send("We don't have this movie ....");
    res.send(movie);
});

router.post('/',async(req, res)=>{
    //validate first ya amaaaar 
    const result = validate(req.body);
    if (result.error){
        return  res.status(400).send('Bad request not vaild movie ...');
    }

    const genre= await Genre.findById(req.body.genreId);
    if (!genre) res.status(404).send('Invalid Genre ...');

    let movie= new Movie({
        title: req.body.title,
        genre:{
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRenatlRate: req.body.dailyRenatlRate
    });
   await movie.save();
    res.send(movie); 
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
    const movie = await Movie.findByIdAndUpdate(req.params.id,
         {
             title: req.body.title,
             genre:{
                _id: genre._id,
                name: genre.name
             } ,
             numberInStock: req.body.numberInStock,
             dailyRenatlRate: req.body.dailyRenatlRate
         } , {new: true})
    if (!movie)res.status(400).send('Bad Request of a Movie ')
    send.res(movie);
});

router.delete('/:id', async (req, res)=>{
    const delMovie = await Movie.findByIdAndRemove(req.params.id);
    if (! delMovie) res.status(404).send('Not Existant Movie to delete...');
    res.send(delMovie);
});

module.exports =router;