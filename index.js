const express = require('express');
const cors = require('cors');
const winston = require('winston');
const app=express();
//require('dotenv').config();

// Cors for cross origin allowance
app.use(cors());

require('./startup/validation');
require('./startup/config')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app);


//listen on port for the client reqs(CRUDS) and get it from the server and display it  
const port =process.env.PORT || 7000;
// returns a server object 
const server = app.listen(port,function(){winston.info(`listening on port ${port} ...`);})

module.exports=server;