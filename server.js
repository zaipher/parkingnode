
const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/config/config.env`});
//console.log(process.env); 
const app = require('./app');

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});

