const fs = require('fs');
const express = require('express');
const router = express.Router();
const users = JSON.parse( 
    fs.readFileSync(`${__dirname}/../1-node-farm/starter/dev-data/users.json`)
);
const getAllUsers = (req, res) => { 
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        results: users.length,
        data: {
            users
        }
    });
};

const getUser = (req, res) => { 
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

const addUser = (req, res) => { 
    const lastUserId = users[users.length - 1].userId;
    // TODO: Add condition to check if the user is a parking owner or a customer
    //const userType = users.find(user => user.userId === req.params.userId);

    const newuserId = `PO-${Number(lastUserId.slice(3)) + 1}`;
    //console.log(newuserId);
    const newuser = Object.assign({ userId:newuserId }, req.body, {createdDate:new Date()});
    users.push(newuser);
    fs.writeFile(`${__dirname}/1-node-farm/starter/dev-data/users.json`, JSON.stringify(users), err => {
        if (err) {
            res.status(500),json({
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

const updateUser = (req, res) => {
    let id = req.params.userId // Get the id from the request params
    const uId = Number(id.slice(3)); // Number of the parking ID 
    const userId = `PO-${Number(id.slice(3))}`; // Concatenate the PID with the parking ID
    //console.log(uId); TODO:

    let userToUpdate = users.find(item => item.userId === id); // Find the data item with the given id
    let userindex = users.indexOf(userToUpdate); // Find the index of the data item with the given id

    const newuserdata = Object.assign(users[userindex], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/1-node-farm/starter/dev-data/users.json`, JSON.stringify(users), err => {
        TODO:// if(!parkingId) {
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
            results: users.length,
            data: {
                users: newuserdata
            },
        });
    });
}

router.route('/')
    .get(getAllUsers)
    .post(addUser);

router.route('/:userId')
    .get(getUser)
    .patch(updateUser);
//     .delete(deleteUser);

module.exports = router