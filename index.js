// FILE
const fs = require('fs');
const http = require('http');
const url = require('url');
const express = require('express');
const morgan = require('morgan');
const replaceTemplate = require(`${__dirname}/1-node-farm/modules/replaceTemplate`);
//const AWS = require('aws-sdk');

const parkingRouter = require(`${__dirname}/routes/parkingRoutes.js`);
const userRouter = require(`${__dirname}/routes/userRoutes.js`);

//Middlware
const app = express();
app.use(express.json()); // to support JSON-encoded bodies as middleware
app.use((req, res, next) => {
    console.log('Logging time of execution');
    req.requestTime = new Date().toISOString();
    next();
});
app.use(morgan('dev'));

Date.prototype.toJSON = function () {
    return this.getTime()
   }

const tempOverview = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-overview.html`, 'utf-8');
const tempTable = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-table.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-product.html`, 'utf-8');
const parkingsdata = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/parkings.json`, 'utf-8');
const usersdata = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/users.json`, 'utf-8');
const dataObj = JSON.parse(parkingsdata);

// TODO: review this as data may be insecured
app.get('/', (req, res) => { 
    res
    .status(200)
    .json({message: 'Hello from the server side!', data: parkingsdata, app: 'Smart Parking'});
});

// Routes
app.use('/api/v1/parkings', parkingRouter);
app.use('/api/v1/users', userRouter);


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
