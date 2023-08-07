const fs = require('fs');
const parkingSlots = JSON.parse( 
    fs.readFileSync(`${__dirname}/../dev-data/parkingslots.json`)
);

Date.prototype.toJSON = function () {
    return this.getTime()
   }

exports.checkRequiredParams = (req, res, next) => { 
    if (!req.body.parkingSlot|| !req.body.parkingGarage || !req.body.flatRate || !req.body.succeedingHours) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required parameters.',
        });
    }
    next();
};

// Route handlers for the parkingSlots
exports.getAllParkingSlots = (req, res) => { 
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        results: parkingSlots.length,
        data: {
            parkingSlots
        }
    });
};


exports.getParkingSlot = (req, res) => { 
    console.log(req.params);
    const parkingSlot = parkingSlots.find(parkingSlot => parkingSlot.parkingSlotId === req.params.parkingSlotId);
     
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
                parkingSlot
        }
    });
};

exports.addParkingSlot = (req, res) => { 
    const lastParkingSlotId = parkingSlots[parkingSlots.length - 1].parkingSlotId;
    const newparkingSlotId = `PS-${Number(lastParkingSlotId.slice(3)) + 1}`;
    const newparkingSlot = Object.assign(
        { parkingSlotId:newparkingSlotId }, 
        req.body, 
        {status: 'new'},
        {createdDate:new Date()}
        );
    parkingSlots.push(newparkingSlot);
    //console.log(parkingSlots);
    fs.writeFile(`${__dirname}/../dev-data/parkingSlots.json`, JSON.stringify(parkingSlots), err => {
        if (err) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to save parkingSlot data.',
            });
        } else {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            results: newparkingSlot.length,
            data: {
                parkingSlots: newparkingSlot
            },
        });
    }
    });
};

exports.updateParkingSlot = (req, res) => {
    let id = req.params.parkingSlotId // Get the id from the request params
    const parkingSlotId = `PS-${Number(id.slice(3))}`; // Concatenate the PID with the parkingSlot ID

    let parkingSlotIdToUpdate = parkingSlots.find(item => item.parkingSlotId === id); // Find the data item with the given id
    let index = parkingSlots.indexOf(parkingSlotIdToUpdate); // Find the index of the data item with the given id

    const parkingSlot = parkingSlots.find(parkingSlot => parkingSlot.parkingSlotId === req.params.parkingSlotId);
    if (!parkingSlot) {
        return res.status(404).json({
        status: 'error',
        message: 'ParkingSlot ID not found'
        });
    } 
    if (parkingSlot.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'ParkingSlot ID was already deleted.'
            });
        } 
    const parkingSlotToUpdate = Object.assign(parkingSlots[index], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/parkingSlots.json`, JSON.stringify(parkingSlots), err => {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                parkingSlots: parkingSlotToUpdate
            },
        });
    });
}

exports.deleteParkingSlot = (req, res) =>     {
    let id = req.params.parkingSlotId // Get the id from the request params
    const parkingSlotId = `PS-${Number(id.slice(3))}`; // Concatenate the PID with the parkingSlot ID
    //console.log(pId); TODO:

    let parkingSlotIdToDelete = parkingSlots.find(item => item.parkingSlotId === id); // Find the data item with the given id
    let index = parkingSlots.indexOf(parkingSlotIdToDelete); // Find the index of the data item with the given id
    
    const parkingSlot = parkingSlots.find(parkingSlot => parkingSlot.parkingSlotId === req.params.parkingSlotId);
    if (!parkingSlot) {
        return res.status(404).json({
        status: 'error',
        message: 'ParkingSlot ID not found'
        });
    } 

    if (parkingSlot.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'ParkingSlot ID was already deleted.'
            });
        } 

    const parkindToDelete = Object.assign(parkingSlots[index], req.body, {status:"deleted"}, {deletedDate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/parkingSlots.json`, JSON.stringify(parkingSlots), err => {
            res.status(204).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                parkingSlots: parkindToDelete
            },
        });
    });  
}