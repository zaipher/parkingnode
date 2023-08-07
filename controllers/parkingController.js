const fs = require('fs');
const parkings = JSON.parse( 
    fs.readFileSync(`${__dirname}/../dev-data/parkings.json`)
);

Date.prototype.toJSON = function () {
    return this.getTime()
   }

exports.checkRequiredParams = (req, res, next) => { 
    if (!req.body.parkingSlot || !req.body.startDate || !req.body.endDate) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required parameters.',
        });
    }
    next();
};

// Route handlers for the parkings
exports.getAllParkings = (req, res) => { 
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        results: parkings.length,
        data: {
            parkings
        }
    });
};


exports.getParking = (req, res) => { 
    console.log(req.params);
    const parking = parkings.find(parking => parking.parkingId === req.params.parkingId);
     
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
                parking
        }
    });
};

exports.addParking = (req, res) => { 
    const lastParkingId = parkings[parkings.length - 1].parkingId;
    const newparkingId = `PID-${Number(lastParkingId.slice(4)) + 1}`;
    const newparking = Object.assign(
        { parkingId:newparkingId }, 
        req.body, 
        {status:"open"},
        {createdDate:new Date()}
        );
    parkings.push(newparking);
    //console.log(parkings);
    fs.writeFile(`${__dirname}/../dev-data/parkings.json`, JSON.stringify(parkings), err => {
        if (err) {
            res.status(500).json({
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

exports.updateParking = (req, res) => {
    let id = req.params.parkingId // Get the id from the request params
    const pId = Number(id.slice(4)); // Number of the parking ID 
    const parkingId = `PID-${Number(id.slice(4))}`; // Concatenate the PID with the parking ID
    //console.log(pId); TODO:

    let parkingIdToUpdate = parkings.find(item => item.parkingId === id); // Find the data item with the given id
    let index = parkings.indexOf(parkingIdToUpdate); // Find the index of the data item with the given id

    const parking = parkings.find(parking => parking.parkingId === req.params.parkingId);
    if (!parking) {
        return res.status(404).json({
        status: 'error',
        message: 'Parking ID not found'
        });
    } 
    if (parking.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'Parking ID was already deleted.'
            });
        } 
    const parkingToUpdate = Object.assign(parkings[index], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/parkings.json`, JSON.stringify(parkings), err => {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                parkings: parkingToUpdate
            },
        });
    });
}

exports.deleteParking = (req, res) =>     {
    let id = req.params.parkingId // Get the id from the request params
    const pId = Number(id.slice(4)); // Number of the parking ID 
    const parkingId = `PID-${Number(id.slice(4))}`; // Concatenate the PID with the parking ID
    //console.log(pId); TODO:

    let parkingIdToDelete = parkings.find(item => item.parkingId === id); // Find the data item with the given id
    let index = parkings.indexOf(parkingIdToDelete); // Find the index of the data item with the given id
    
    const parking = parkings.find(parking => parking.parkingId === req.params.parkingId);
    if (!parking) {
        return res.status(404).json({
        status: 'error',
        message: 'Parking ID not found'
        });
    } 

    if (parking.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'Parking ID was already deleted.'
            });
        } 

    const parkindToDelete = Object.assign(parkings[index], req.body, {status:"deleted"}, {deletedDate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/parkings.json`, JSON.stringify(parkings), err => {
            res.status(204).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                parkings: null
            },
        });
    });  
}