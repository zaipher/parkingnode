// FILE
const fs = require('fs');
const http = require('http');
const url = require('url');
const express = require('express');
const slugify = require('slugify');
const { toUnicode } = require('punycode');
const replaceTemplate = require(`${__dirname}/1-node-farm/modules/replaceTemplate`);
//SERVER

const app = express();
app.use(express.json()); // to support JSON-encoded bodies as middleware

Date.prototype.toJSON = function () {
    return this.getTime()
   }
const tempOverview = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-overview.html`, 'utf-8');
const tempTable = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-table.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const dataFile = '1-node-farm/starter/dev-data/data.json';

// Helper function to read the JSON data from the file
function readDataFile() {
  try {
    const jsonData = fs.readFileSync(dataFile);
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
}

// Helper function to write the JSON data to the file
function writeDataFile(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
  }
}

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

// get all the parkings from the data.json file
app.get('/api/v1/parkings', (req, res) => { 
    res.status(200).json({
        status: 'success',
        results: parkings.length,
        data: {
            parkings
        }
    });
});

// get all the parkings from the data.json file with parameters
app.get('/api/v1/parkings/:parkingId', (req, res) => { 
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
        data: {
                parking
        }
    });
});

// TODO: this
// app.get('/api/v1/parkings/status?', (req, res) => { 
//     console.log(req.params);

//     const parkingstatus = parkings.find(el => el.status === req.params.status);
//     res.status(200).json({
//         status: 'success',
//         data: {
//                 parkingstatus
//         }
//     });
// });

app.get('/api/v1/tours', (req, res) => { 
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});
// console.log(parkings.length-1);

// const newparkingId = parkings.length;
// console.log(newparkingId);
// console.log(parkings[newparkingId])

// const result1 = num.toString().slice(2);
// console.log(result1);

// const slideparkingId = newparkingId.slice(4);
// console.log(slideparkingId);

//const newparkingId = parkings[parkings.length - 1].parkingid + 1;

// const parkingId = "PID-10001"
// const result1 = Number(parkingId.slice(4))+1;
// //console.log(Number(result1)+1);
// console.log(result1);

// const parkingId = parkings[parkings.length - 1];
// let id = parkingId.parkingId;
// id = Number(id.slice(4))+1;
// const parkingID = "PID-"
// const newparkingId = parkingID.concat(id);
// console.log(newparkingId);
//newparkingId = Number(parkingId.slice(4))+1;

//2
// const parkingId = parkings[parkings.length - 1];
//     const newparkingId = parkingId.parkingId;

// 3
// const parkingID = "PID-"
// const id = 100001
// const newparkingId = "PID".concat(id);
// console.log(newparkingId);


//4
// const lastParkingId = parkings[parkings.length - 1].parkingId;
// const newId = `PID-${Number(lastParkingId.slice(4)) + 1}`;
// console.log(newId);
// console.log(parkings)

//Date test
// Date.prototype.toJSON = function () {
//     return this.getTime()
//    }
//    const user = {
//      name: 'Joe',
//      updated: new Date()
//    }
// console.log(user);

app.post('/api/v1/tours', (req, res) => { 
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id:newId }, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/1-node-farm/starter/dev-data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status:'success',
            results: tours.length,
            data: {
                tours: newTour
            },
        });
    }
)
});

app.post('/api/v1/parkings', (req, res) => { 
    //console.log(req.body);
    // TEST 3
    // const parkingId = parkings[parkings.length - 1];
    // const unslicedparkingId = parkingId.parkingId;
    // const id = Number(unslicedparkingId.slice(4))+1;
    // const newparkingId = "PID-".concat(id);
    // console.log(newparkingId);

    // TEST 4 Get the last parking id from the database and increment it by 1 
    const lastParkingId = parkings[parkings.length - 1].parkingId;
    const newparkingId = `PID-${Number(lastParkingId.slice(4)) + 1}`;
    console.log(newparkingId);

    // const newparkingId = parkings[parkings.length - 1];
    // console.log(newparkingId);
    const newparking = Object.assign({ parkingId:newparkingId }, req.body, {created:new Date()});
    console.log(newparking);
    parkings.push(newparking);
    //console.log(parkinds);
    fs.writeFile(`${__dirname}/1-node-farm/starter/dev-data/data.json`, JSON.stringify(parkings), err => {
        if (err) {
            res.status(500),json({
                status: 'error',
                message: 'Failed to save parking data.',
            });
        } else {
            res.status(201).json({
            status:'success',
            results: newparking.length,
            data: {
                parkings: newparking
            },
        });
    }
    });
});


// app.patch('/api/v1/parkings/:parkingId', (req, res) => {
    
//     const newValue = req.body.value;
//       // Find the data item with the given id
//     const parking = parkings.find(parking => parking.parkingId === req.params.parkingId);

//   if (!parking) {
//     // If the item with the given id is not found, return 404 Not Found
//     return res.status(404).json({ message: 'Data not found' });
//   }
//   // Update the value
//   parking.value = newValue;
//   console.log(newValue);
//   console.log(parking.value);

//   // Return 200 OK to indicate successful update
// //   res.status(200).json({ message: 'Value updated successfully', parkings: parking });
//   fs.writeFile(`${__dirname}/1-node-farm/starter/dev-data/data.json`, JSON.stringify(parkings), err => {
//     res.status(201).json({
//         status:'success',
//         data: {
//             parkings: parking.value
//         },
//     });
// }
// )
// });
// app.patch('/api/v1/parkings/:parkingId', (req, res) => {
//     // const lastParkingId = parkings[parkings.length - 1].parkingId;
//     // const newparkingId = `PID-${Number(lastParkingId.slice(4)) + 1}`;
//     // console.log(newparkingId);
//     const parkingId = req.params.parkingId;
//     console.log(parkingId);
//     const newValue = req.body;
//     console.log(newValue);
  
//     let parkings = readDataFile();

//     // Find the data item with the given id
//     const itemToUpdate = parkings.find(item => item.parkingId === parkingId);
    
//     //console.log(itemToUpdate);
  
//     if (!itemToUpdate) {
//       // If the item with the given id is not found, return 404 Not Found
//       return res.status(404).json({ message: 'Data not found' });
//     }
  
//     // Update the value
//     itemToUpdate.value = newValue;
//     //console.log(itemToUpdate.value);
  
//     // Save the updated data back to the file
//     writeDataFile(parkings);
  
//     // Return 200 OK to indicate successful update
//     res.status(200).json({ message: 'Value updated successfully', parkings: itemToUpdate });
//   });



app.patch('/api/v1/parkings/:parkingId', (req, res) => {
    let id = req.params.parkingId // Get the id from the request params
    const pId = Number(id.slice(4)); // Number of the parking ID 
    const parkingId = `PID-${Number(id.slice(4))}`; // Concatenate the PID with the parking ID
    console.log(pId);

    let parkingToUpdate = parkings.find(item => item.parkingId === id); // Find the data item with the given id
    let index = parkings.indexOf(parkingToUpdate); // Find the index of the data item with the given id

    const newparking = Object.assign(parkings[index], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    console.log(newparking); // Display the new parking object

    parkings[index].parkingId = id;
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
            results: parkings.length,
            data: {
                parkings: parkingToUpdate
            },
        });
    });
});

//     //if(req.params.parkingId * 1 > parkings.length) {
//     if (err) {
//         res.status(404),json({
//             status: 'error',
//             message: 'Failed to save parking data.',
//         });
//     }
//     res.status(200).json({
//         status:'success',
//                 results: parkings.length,
//                 data: {
//                     parkings: '<Updated parking data>'
//                 }
//  });
// });

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
