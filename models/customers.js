const Joi=require('joi');
const mongoose= require('mongoose');

// validation of any input 
function validateCustomer(customer){
    const schema={
        name:Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone:Joi.string().min(7).max(50).required()
    };

    return Joi.validate(customer,schema);
}


// making the schema
const customerSchema =mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 70
     },
    isGold:{
        type :Boolean, 
        default : false },
    phone:{
        type:String,
        required: true,
        minlength:7,
        maxlength:50
    }
});


// making a model 
const Customer = mongoose.model('Customer', customerSchema);

exports.Customer = Customer;
exports.validate= validateCustomer; 