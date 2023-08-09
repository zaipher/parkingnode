
const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/config/config.env`});
//console.log(process.env); 
const app = require('./app');

// const parkingDB = process.env.PARKINGS_DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
// mongoose
//   .connect(parkingDB, { 
//     useNewUrlParser: true
//   }).then(con => console.log('Connected to database'));

// Test adding a new parking document
// const testParking = new Parking({ // instance of the Parking Model
//   parkingId: "PID-10001",
//   parkingSlot: "B3-105",
//   status: "Open",
//   parkingGarage: "Sheridan ST",
//   startDate: "2023-08-27 07:30:00",
//   endDate: "2023-08-27 20:00:00",
//   flatRate: 50.0,
//   succeedingHours: 10.0,
//   parkingOwner: "PO-10133",
//   createdAt: "",
//   updatedAt: "",
//   driverName: "",
//   plateNumber: "",
//   phoneNumber: ""
// });

// testParking.save().then(doc => {
//   console.log(doc);
// }).catch(err => {
//   console.log('ERROR', err);  
// });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

