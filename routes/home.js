const express=require('express');
const router=express.Router();

    // getting a genre from the db thr the server 
    router.get('/',(req,res)=>{
        res.send("Welcome to VIDLY movies store ^^ ")
    });

module.exports=router;