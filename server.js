const app = require('./app');
// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

