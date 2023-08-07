const fs = require('fs');
const owners = JSON.parse( 
    fs.readFileSync(`${__dirname}/../dev-data/owners.json`)
);
Date.prototype.toJSON = function () {
    return this.getTime()
   }

exports.checkRequiredParams = (req, res, next) => { 
    if (!req.body.password || !req.body.emailaddress || !req.body.name) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required parameters.',
        });
    }
    next();
};
exports.getAllOwners = (req, res) => { 
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        results: owners.length,
        data: {
            owners
        }
    });
};

exports.getOwner = (req, res) => { 
    console.log(req.params);
    const owner = owners.find(owner => owner.ownerId === req.params.ownerId);
    if (!owner) {
        return res.status(404).json({
        status: 'error',
        message: 'Owner not found'
        });
    }
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
                owner
        }
    });
};

exports.addOwner = (req, res) => { 
    const lastOwnerId = owners[owners.length - 1].ownerId;
    const newownerId = `PO-${Number(lastOwnerId.slice(3)) + 1}`;
    const newowner = Object.assign(
        { ownerId:newownerId}, 
        req.body,
        {type:"owner"},
        {status:"new"},
        {verified:false},
        {createdDate:new Date()}
        );
    owners.push(newowner);
    fs.writeFile(`${__dirname}/../dev-data/owners.json`, JSON.stringify(owners), err => {
        if (err) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to add new owner.',
            });
        } else {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            results: newowner.length,
            data: {
                owners: newowner
            },
        });
    }
    });
};

exports.updateOwner = (req, res) => {
    let id = req.params.ownerId // Get the id from the request params
    const uId = Number(id.slice(3)); // Number of the parking ID 
    const ownerId = `PO-${Number(id.slice(3))}`; // Concatenate the PID with the parking ID
    //console.log(uId); TODO:

    let ownerIdToUpdate = owners.find(item => item.ownerId === id); // Find the data item with the given id
    let ownerindex = owners.indexOf(ownerIdToUpdate); // Find the index of the data item with the given id

    const owner = owners.find(owners => owners.ownerId === req.params.ownerId);
    if (!owner) {
        return res.status(404).json({
        status: 'error',
        message: 'Owner ID not found'
        });
    } 
    if (owner.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'Owner ID was already deleted.'
            });
        } 
    const ownerToUpdate = Object.assign(owners[ownerindex], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/owners.json`, JSON.stringify(owners), err => {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                owners: ownerToUpdate
            },
        });
    });
}

exports.deleteOwner = (req, res) => {
    let id = req.params.ownerId // Get the id from the request params
    const uId = Number(id.slice(3)); // Number of the parking ID 
    const ownerId = `PO-${Number(id.slice(3))}`; // Concatenate the PID with the parking ID
    //console.log(uId); TODO:

    let ownerIdToDelete = owners.find(item => item.ownerId === id); // Find the data item with the given id
    let ownerindex = owners.indexOf(ownerIdToDelete); // Find the index of the data item with the given id

    const owner = owners.find(owner => owner.ownerId === req.params.ownerId);
    if (!owner) {
        return res.status(404).json({
        status: 'error',
        message: 'Owner ID not found'
        });
    } 

    if (owner.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'Owner ID was already deleted.'
            });
        } 
    const ownerToDelete = Object.assign(owners[ownerindex], req.body, {status:"deleted"}, {deletedDate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/owners.json`, JSON.stringify(owners), err => {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                owners: ownerToDelete
            },
        });
    });
}