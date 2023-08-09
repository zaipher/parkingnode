const Parking = require('../models/parkingModel');

// Date.prototype.toJSON = function () {
//     return this.getTime()
//    }

exports.getAllParkings = (req, res) => { 
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        // results: parkings.length,
        // data: {
        //     parkings
        // }
    });
};


exports.getParking = (req, res) => { 
    console.log(req.params);
    // const parking = parkings.find(parking => parking.parkingId === req.params.parkingId);
     
    // res.status(200).json({
    //     status: 'success',
    //     requestedAt: req.requestTime,
    //     data: {
    //             parking
    //     }
    // });
};

exports.addParking = async (req, res) => { 
    //try { 

    // const newParking = new Parking({});
    // newParking.save();
    // let id = req.params.parkingId // Get the id from the request params
    // const parkingId = `PID-${Number(id.slice(4))}`; // Concatenate the PID with the parking ID
    //const parking = parkings.find(parking => parking.parkingId === req.params.parkingId);
    const newParking = await Parking.create(req.body);
        res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            // results: newparking.length,
            data: {
                 parking: newParking
            },
        });
    } 
    // catch (err) {
    //     res.status(500).json({
    //         status: 'error',
    //         message: 'Failed to save parking data.',
    //     });
    // }
//};

exports.updateParking = (req, res) => {
    // const lastParkingId = parkings[parkings.length - 1].parkingId;
    // const newparkingId = `PID-${Number(lastParkingId.slice(4)) + 1}`;


    // let id = req.params.parkingId // Get the id from the request params
    // const pId = Number(id.slice(4)); // Number of the parking ID 
    // const parkingId = `PID-${Number(id.slice(4))}`; // Concatenate the PID with the parking ID
    // //console.log(pId); TODO:

    // let parkingIdToUpdate = parkings.find(item => item.parkingId === id); // Find the data item with the given id
    // let index = parkings.indexOf(parkingIdToUpdate); // Find the index of the data item with the given id

    // const parking = parkings.find(parking => parking.parkingId === req.params.parkingId);
    // if (!parking) {
    //     return res.status(404).json({
    //     status: 'error',
    //     message: 'Parking ID not found'
    //     });
    // } 
    // if (parking.status === "deleted") {
    //     return res.status(404).json({
    //         status: 'error',
    //         message: 'Parking ID was already deleted.'
    //         });
    //     } 
    // const parkingToUpdate = Object.assign(parkings[index], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    // fs.writeFile(`${__dirname}/../dev-data/parkings.json`, JSON.stringify(parkings), err => {
            res.status(201).json({
            status:'success',
            // requestedAt: req.requestTime,
            // data: {
            //     parkings: parkingToUpdate
            // },
        });
//     });
 }

exports.deleteParking = (req, res) =>     {
    // let id = req.params.parkingId // Get the id from the request params
    // const pId = Number(id.slice(4)); // Number of the parking ID 
    // const parkingId = `PID-${Number(id.slice(4))}`; // Concatenate the PID with the parking ID
    // //console.log(pId); TODO:

    // let parkingIdToDelete = parkings.find(item => item.parkingId === id); // Find the data item with the given id
    // let index = parkings.indexOf(parkingIdToDelete); // Find the index of the data item with the given id
    
    // const parking = parkings.find(parking => parking.parkingId === req.params.parkingId);
    // if (!parking) {
    //     return res.status(404).json({
    //     status: 'error',
    //     message: 'Parking ID not found'
    //     });
    // } 

    // if (parking.status === "deleted") {
    //     return res.status(404).json({
    //         status: 'error',
    //         message: 'Parking ID was already deleted.'
    //         });
    //     } 

    // const parkindToDelete = Object.assign(parkings[index], req.body, {status:"deleted"}, {deletedDate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    // fs.writeFile(`${__dirname}/../dev-data/parkings.json`, JSON.stringify(parkings), err => {
            res.status(204).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                parkings: null
            },
        });
//     });  
 }
