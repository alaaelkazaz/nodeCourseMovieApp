const asyncMiddleWare = require('../middleware/async');
const validateObjectId = require('../middleware/vaildateObjectId');
const express =require('express');
const auth =require('../middleware/auth');
const router = express.Router();
const mongoose= require('mongoose');
const Joi=require('joi');
const {Genre , validate } = require('../models/genres');
/*
http://vidly.com/api/genres
implement genre list and make a endpoint for it 
create a new genre 
get a genre 
update a genre 
delete a genre 
*/
/*
genres=[
    {id:1, name: "Cartoon "},
    {id:2, name: "Romance "},
    {id:3, name: "Fantasy "},
    {id:4, name: "Documentary "}];
    */
  
// set up( make your app routes using http CRUDS ) 
router.get('/',asyncMiddleWare(async (req, res)=>{
        const genres= await Genre.find().sort('name');
        res.send(genres);
}));

router.get('/:id',validateObjectId,async (req,res)=>{
   

    const genre = await Genre.findById(req.params.id);
    if (!genre) res.status(404).send('the genrre was not found');
    res.send(genre)
    
    /*genre=genres.find( g=> g.id ===parseInt(req.params.id));
    if (genre)
    res.send(genre);
    else
    res.send("Genre Not Found");
    */
})

// use middleware to authorize only registered users to add a new genre 
// like that router.post('/', auth, async (req,res)=>
router.post('/',async (req,res)=>{


    // input validation using joi 
    result= validate(req.body);
    if(result.error){
    //400 bad request 
    res.status(400).send('Name is invalid')
    return 
    };
    let genre = new Genre({name : req.body.name})
    genre = await genre.save();
    res.send(genre);
    /* old implementation using a fake databse 
    genre={id:genres.length+1 ,
    name:req.body.name}
    genres.push(genre);
    res.send(genre)
    */
});
//************************************************************************ */

// refactoring --> making a validate function to use in post and put 
// updating an existance genre
router.put('/:id',async (req,res)=>{
    // update first approach 
    // findByIdAndUpdate(the id , the update , the option object )
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name : req.body.name }, { new : true });
    //look up for the course 
    //genre=genres.find( g=> g.id ===parseInt(req.params.id));
    if (!genre) res.status(404);
    // validate the change 
    //const result = validateGenre(req.body);
    //if(result.error){
    //400 bad request 
    //res.status(400).send('Name is invalid')
    //return 
    //};
    //update the genre 
    //genre.name=req.body.name ;
    //return the updated genre 
    res.send(genre)

})

// deleting an exsitance genre 
router.delete('/:id',async (req,res)=>{
    //find the genre 
    const genre = await Genre.findByIdAndRemove(req.params.id)
    //genre=genres.find( g=> g.id ===parseInt(req.params.id));
    if (!genre) res.status(404).send("Not found");
    /*
    //deleting from an array 
    const index=genres.indexOf(genre)
    genres.splice(index,1)
    */
    res.send(genre)
});

module.exports=router;