// FILE
const fs = require('fs');
const http = require('http');
const url = require('url');
const express = require('express');
const morgan = require('morgan');

const parkingRouter = require(`${__dirname}/routes/parkingRoutes.js`);
const ownerRouter = require(`${__dirname}/routes/ownerRoutes.js`);
const customerRouter = require(`${__dirname}/routes/customerRoutes.js`);

//Middlware
const app = express();

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Middleware
app.use(express.json()); // to support JSON-encoded bodies as middleware
//app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

// Date.prototype.toJSON = function () {return this.getTime()}

app.use((req, res, next) => {
    console.log('Logging time of execution');
    req.requestTime = new Date().toISOString();
    next();
});

// TODO: review this as data may be insecured
app.get('/', (req, res) => { 
    res
    .status(200)
    .json({message: 'Hello from the server side!', data: parkingsdata, app: 'Smart Parking'});
});

// Routes
app.use('/api/v1/parking', parkingRouter);
app.use('/api/v1/owner', ownerRouter);
app.use('/api/v1/customer', customerRouter);

module.exports = app;

