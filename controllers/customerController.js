const fs = require('fs');
const customers = JSON.parse( 
    fs.readFileSync(`${__dirname}/../dev-data/customers.json`)
);
Date.prototype.toJSON = function () {
    return this.getTime()
   }
exports.getAllCustomers = (req, res) => { 
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        results: customers.length,
        data: {
            customers
        }
    });
};

exports.getCustomer = (req, res) => { 
    console.log(req.params);
    const customer = customers.find(customer => customer.customerId === req.params.customerId);
    if (!customer) {
        return res.status(404).json({
        status: 'error',
        message: 'Customer ID not found'
        });
    }
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
                customer
        }
    });
};

exports.addCustomer = (req, res) => { 
    const lastCustomerId = customers[customers.length - 1].customerId;
    const newcustomerId = `PC-${Number(lastCustomerId.slice(3)) + 1}`;
    const newcustomer = Object.assign(
        {customerId:newcustomerId}, 
        req.body,
        {type:"customer"},
        {status:"new"},
        {verified:false},
        {createdDate:new Date()}
        );
    customers.push(newcustomer);
    fs.writeFile(`${__dirname}/../dev-data/customers.json`, JSON.stringify(customers), err => {
        if (err) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to add new customer.',
            });
        } else {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            results: newcustomer.length,
            data: {
                customers: newcustomer
            },
        });
    }
    });
};

exports.updateCustomer = (req, res) => {
    let id = req.params.customerId 
    const customerId = `PC-${Number(id.slice(3)) + 1}`;
    //console.log(uId); TODO:

    let customerIdToUpdate = customers.find(item => item.customerId === id); // Find the data item with the given id
    let customerindex = customers.indexOf(customerIdToUpdate); // Find the index of the data item with the given id

    const customer = customers.find(customers => customers.customerId === req.params.customerId);
    if (!customer) {
        return res.status(404).json({
        status: 'error',
        message: 'Customer ID not found'
        });
    } 
    if (customer.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'Customer ID was already deleted.'
            });
        } 
    const customerToUpdate = Object.assign(customers[customerindex], req.body, {lastUpdate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/customers.json`, JSON.stringify(customers), err => {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                customers: customerToUpdate
            },
        });
    });
}

exports.deleteCustomer = (req, res) => {
    let id = req.params.customerId // Get the id from the request params
    const uId = Number(id.slice(3)); // Number of the parking ID 
    const customerId = `PC-${Number(id.slice(3))}`; // Concatenate the PID with the parking ID
    //console.log(uId); TODO:

    let customerIdToDelete = customers.find(item => item.customerId === id); // Find the data item with the given id
    let customerindex = customers.indexOf(customerIdToDelete); // Find the index of the data item with the given id

    const customer = customers.find(customer => customer.customerId === req.params.customerId);
    if (!customer) {
        return res.status(404).json({
        status: 'error',
        message: 'Customer ID not found'
        });
    } 

    if (customer.status === "deleted") {
        return res.status(404).json({
            status: 'error',
            message: 'Customer ID was already deleted.'
            });
        } 
    const customerToDelete = Object.assign(customers[customerindex], req.body, {status:"deleted"}, {deletedDate:new Date()}); // Create a new object with the data item with the given id and add lastupdate date/time
    fs.writeFile(`${__dirname}/../dev-data/customers.json`, JSON.stringify(customers), err => {
            res.status(201).json({
            status:'success',
            requestedAt: req.requestTime,
            data: {
                customers: customerToDelete
            },
        });
    });
}