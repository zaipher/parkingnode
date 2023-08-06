const fs = require('fs');
const users = JSON.parse( 
    fs.readFileSync(`${__dirname}/../dev-data/users.json`)
);
exports.getAllUsers = (req, res) => { 
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        results: users.length,
        data: {
            users
        }
    });
};

exports.getUser = (req, res) => { 
    console.log(req.params);
    const user = users.find(user => user.userId === req.params.userId);
    if (!user) {
        return res.status(404).json({
        status: 'error',
        message: 'User not found'
        });
    }
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
                user
        }
    });
};

exports.addUser = (req, res) => { 
    const lastUserId = users[users.length - 1].userId;
    // TODO: Add condition to check if the user is a parking owner or a customer
    //const userType = users.find(user => user.userId === req.params.userId);

    const newuserId = `PO-${Number(lastUserId.slice(3)) + 1}`;
    //console.log(newuserId);
    const newuser = Object.assign({ userId:newuserId }, req.body, {createdDate:new Date()});
    users.push(newuser);
    fs.writeFile(`${__dirname}/../dev-data/users.json`, JSON.stringify(users), err => {
        if (err) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to add new user.',
            });
        } else {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            results: newuser.length,
            data: {
                users: newuser
            },
        });
    }
    });
};

exports.updateUser = (req, res) => {
    let id = req.params.userId // Get the id from the request params
    const uId = Number(id.slice(3)); // Number of the parking ID 
    const userId = `PO-${Number(id.slice(3))}`; // Concatenate the PID with the parking ID
    //console.log(uId); TODO:

    let userIdToUpdate = users.find(item => item.userId === id); // Find the data item with the given id
    let userindex = users.indexOf(userIdToUpdate); // Find the index of the data item with the given id

    const user = users.find(users => users.userId === req.params.userId);
    if (!user) {
        return res.status(404).json({
        status: 'error',
        message: 'User ID not found'
        });
    } 
    if (user.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'User ID was already deleted.'
            });
        } 
    const userToUpdate = Object.assign(users[userindex], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/users.json`, JSON.stringify(users), err => {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                users: userToUpdate
            },
        });
    });
}

exports.deleteUser = (req, res) => {
    let id = req.params.userId // Get the id from the request params
    const uId = Number(id.slice(3)); // Number of the parking ID 
    const userId = `PO-${Number(id.slice(3))}`; // Concatenate the PID with the parking ID
    //console.log(uId); TODO:

    let userIdToDelete = users.find(item => item.userId === id); // Find the data item with the given id
    let userindex = users.indexOf(userIdToDelete); // Find the index of the data item with the given id

    const user = users.find(user => user.userId === req.params.userId);
    if (!user) {
        return res.status(404).json({
        status: 'error',
        message: 'User ID not found'
        });
    } 

    if (user.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'User ID was already deleted.'
            });
        } 
    const userToDelete = Object.assign(users[userindex], req.body, {status:"deleted"}, {deletedDate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/users.json`, JSON.stringify(users), err => {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                users: userToDelete
            },
        });
    });
}