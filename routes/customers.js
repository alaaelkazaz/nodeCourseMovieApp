const express =require('express');
const router = express.Router();
const mongoose= require('mongoose');
const {Customer , validate } = require('../models/customers');

// customrs main page
router.get('/',async (req,res)=>{
    const customers= await Customer.find().sort('name');
    res.send(customers);
});

// get a customer with an id 
router.get('/:id',async (req,res)=>{
    const customr = await Customer.findById(req.params.id);
    if (!customr) res.status(404).send('the Customer was not found');
    res.send(customr)
});
// post a new customer 

router.post('/',async(req,res)=>{
    // validation 
    const result=validate(req.body);
    if (result.error){
         res.status(400).send('Invalid posting ...');
         return ;
    }
    let  customer = new Customer({name : req.body.name, isGold:req.body.isGold , phone: req.body.phone});
    customer = await customer.save();
    res.send(customer);
});
// put a customer with an id 
router.put('/:id',async(req, res)=>{
    // update first approach 
    const customer = await Customer.findByIdAndUpdate(req.params.id,{ name: req.body.name}, { new : true});
    if (!customer) res.status(404).send('Not Found...');
    res.send(customr);
});

// delet a given customer 

router.delete('/:id', async (req, res)=>{
    const customerdel= await Customer.findByIdAndRemove(req.params.id);
    if ( !customerdel) res.status(404).send('Not found to be deleted...');
    res.send(customerdel);
})

module.exports=router;