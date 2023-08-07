
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/config/config.env`});
//console.log(process.env); 
const app = require('./app');

const parkingDB = process.env.PARKINGS_DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(parkingDB, { 
    useNewUrlParser: true
  }).then(con => console.log('Connected to database'));

const parkingSchema = new mongoose.Schema({
  parkingId: {type: String,unique: true},
  parkingSlot: {type: String,required: true},
  parkingGarage: { type: String,required: true},
  flatRate: {type: Number,required: true},
  succeedingHours: {type: Number,required: true},
  startDate: {type: Date},
  endDate: {type: Date},
  createdAt: {type: Date,default: Date.now},
  updatedAt: {type: Date,default: Date.now},
  status: String,
  parkingOwner: { type: String, required: true},
  driverName: {type: String,default: ""},
  plateNumber: {type: String,default: ""},
  phoneNumber: {type: String,default: ""}
});

const Parking = mongoose.model('Parking', parkingSchema); // create a new instance of the Parking Model

const testParking = new Parking({ // instance of the Parking Model
  parkingId: "PID-10001",
  parkingSlot: "B3-105",
  status: "Open",
  parkingGarage: "Sheridan ST",
  startDate: "2023-08-27 07:30:00",
  endDate: "2023-08-27 20:00:00",
  flatRate: 50.0,
  succeedingHours: 10.0,
  parkingOwner: "PO-10133",
  createdAt: "",
  updatedAt: "",
  driverName: "",
  plateNumber: "",
  phoneNumber: ""
});

testParking.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log('ERROR', err);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});

