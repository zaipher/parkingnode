const fs = require('fs');
const express = require('express')
const router = express.Router();

const parkings = JSON.parse( 
    fs.readFileSync(`${__dirname}/../dev-data/parkings.json`)
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
// TODO: AWS DynamoDB
// const getAllParkings = (req, res) => {
//     const params = {
//       TableName: 'parkings', // Replace with your DynamoDB table name
//     };
  
//     dynamoDB.scan(params, (error, data) => {
//       if (error) {
//         console.error('Error querying DynamoDB:', error);
//         // Handle the error accordingly
//         res.status(500).json({ status: 'error', message: 'Error querying data' });
//       } else {
//         const parkings = data.Items;
//         res.status(200).json({
//           status: 'success',
//           results: parkings.length,
//           data: { parkings },
//         });
//       }
//     });
//   };
  

const addParking = (req, res) => { 
    const lastParkingId = parkings[parkings.length - 1].parkingId;
    const newparkingId = `PID-${Number(lastParkingId.slice(4)) + 1}`;
    const newparking = Object.assign({ parkingId:newparkingId }, req.body, {createdDate:new Date()});
    parkings.push(newparking);
    fs.writeFile(`${__dirname}/dev-data/parkings.json`, JSON.stringify(parkings), err => {
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
    fs.writeFile(`${__dirname}/dev-data/parkings.json`, JSON.stringify(parkings), err => {
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
                parkings: newparking
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
    fs.writeFile(`${__dirname}/dev-data/parkings.json`, JSON.stringify(parkings), err => {
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

router.route('/')
    .get(getAllParkings)
    .post(addParking);

router.route('/:parkingId')
    .get(getParking)
    .patch(updateParking)
    .delete(deleteParking);

module.exports = router;