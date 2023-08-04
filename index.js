// FILE
const fs = require('fs');
const http = require('http');
const url = require('url');
const express = require('express');
const morgan = require('morgan');
const replaceTemplate = require(`${__dirname}/1-node-farm/modules/replaceTemplate`);

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
const data = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const dataFile = '1-node-farm/starter/dev-data/data.json';

// render the home page
app.get('/', (req, res) => { 
    res
    .status(200)
    .json({message: 'Hello from the server side!', data: data, app: 'Smart Parking'});
});

// get the parkings from the data.json file
const parkings = JSON.parse( 
    fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`)
);
const tours = JSON.parse( 
    fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/tours-simple.json`)
);

// Route handlers for the parkings
const getAllParkings = (req, res) => { 
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        results: parkings.length,
        data: {
            parkings
        }
    });
};

const getParking = (req, res) => { 
    console.log(req.params);
    const parking = parkings.find(parking => parking.parkingId === req.params.parkingId);
    if (!parking) {
        return res.status(404).json({
        status: 'error',
        message: 'Parking not found'
        });
    }
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
                parking
        }
    });
};

const createParking = (req, res) => { 
    const lastParkingId = parkings[parkings.length - 1].parkingId;
    const newparkingId = `PID-${Number(lastParkingId.slice(4)) + 1}`;
    const newparking = Object.assign({ parkingId:newparkingId }, req.body, {created:new Date()});
    parkings.push(newparking);
    fs.writeFile(`${__dirname}/1-node-farm/starter/dev-data/data.json`, JSON.stringify(parkings), err => {
        if (err) {
            res.status(500),json({
                status: 'error',
                message: 'Failed to save parking data.',
            });
        } else {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            results: newparking.length,
            data: {
                parkings: newparking
            },
        });
    }
    });
};

const updateParking = (req, res) => {
    let id = req.params.parkingId // Get the id from the request params
    const pId = Number(id.slice(4)); // Number of the parking ID 
    const parkingId = `PID-${Number(id.slice(4))}`; // Concatenate the PID with the parking ID
    //console.log(pId); TODO:

    let parkingToUpdate = parkings.find(item => item.parkingId === id); // Find the data item with the given id
    let index = parkings.indexOf(parkingToUpdate); // Find the index of the data item with the given id

    const newparking = Object.assign(parkings[index], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/1-node-farm/starter/dev-data/data.json`, JSON.stringify(parkings), err => {
        // if(!parkingId) {
        //     if (err) {
        //     res.status(500).json({
        //         status: 'error',
        //         message: 'Failed to save parking data.',
        //     });
        // }
        // else {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            results: parkings.length,
            data: {
                parkings: parkingToUpdate
            },
        });
    });
}

// FIXME:
const deleteParking = (req, res) => {
    let id = req.params.parkingId // Get the id from the request params
    const pId = Number(id.slice(4)); // Number of the parking ID 
    const parkingId = `PID-${Number(id.slice(4))}`; // Concatenate the PID with the parking ID
    console.log(pId);

    let parkingToUpdate = parkings.find(item => item.parkingId === id); // Find the data item with the given id
    let index = parkings.indexOf(parkingToUpdate); // Find the index of the data item with the given id

    const newparking = Object.assign(parkings[index], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    //console.log(newparking); // Display the new parking object

    //parkings[index].parkingId = id;
    fs.writeFile(`${__dirname}/1-node-farm/starter/dev-data/data.json`, JSON.stringify(parkings), err => {
        // if(!parkingId) {
        //     if (err) {
        //     res.status(500).json({
        //         status: 'error',
        //         message: 'Failed to save parking data.',
        //     });
        // }
        // else {
            res.status(204).json({
            status:'success',
            requestedAt: req.requestTime,
            results: parkings.length,
            data: null
        });
    });
}

// // get all the parkings from the data.json file
// app.get('/api/v1/parkings', getAllParkings);
// // get specific parking from the data.json file
// app.get('/api/v1/parkings/:parkingId', getParking);
// create a new parking
// app.post('/api/v1/parkings', createParking);
// // update a specific parking in the data.json file
// app.patch('/api/v1/parkings/:parkingId', updateParking);
//app.delete('/api/v1/parkings/:parkingId', deleteParking);

// Routes


const parkingRouter = express.Router();
const userRouter = express.Router();

parkingRouter.route('/')
    .get(getAllParkings)
    .post(createParking);

parkingRouter.route('/:parkingId')
    .get(getParking)
    .patch(updateParking)
    .delete(deleteParking);

// userRouter.route('/')
//     .get(getAllUsers)
//     .post(createUser);

// userRouter.route('/:userId')
//     .get(getUser)
//     .patch(updateUser)
//     .delete(deleteUser);

app.use('/api/v1/parkings', parkingRouter);
app.use('/api/v1/users', userRouter);
// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
