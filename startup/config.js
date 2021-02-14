const config =require('config');

module.exports = function(){

    /*
    if (!config.get('JwtPrivateKey')){
        throw new Error('Fatal Error : JWT Private Key is Not defined');
    }
    */
   // make sure private key of jwt is set for privacy of our data
    console.log(`Our configuration Enviro:${process.env.NODE_ENV}`);
    
    console.log("Our configuration name: "+ config.get('name'));
    console.log("Our configuration jwt Token: "+ config.get('JwtPrivateKey'));

};