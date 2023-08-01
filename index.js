// // 1 Reading and Writing files / Synchronous / Blocking model
// const fs = require('fs');
// const input = fs.readFileSync('1-node-farm/starter/txt/input.txt', 'utf-8');
// console.log(input)

// const output = `Some description about avocado ${input}. \nCreated by ${Date.now()}`
// fs.writeFileSync('1-node-farm/starter/txt/output.txt', output)
// console.log('Message was written')
// // ==========

// // Asynchronous non-blocking way to read file
// const fs = require('fs');
// fs.readFile('./1-node-farm/starter/txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//     });
// });
// console.log('Will read file');

// // // ==========

// Readind and writing files in Async
// const fs = require('fs');
// fs.readFile('./1-node-farm/starter/txt/start1.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log("ERROR: file cannot found")
//     fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./1-node-farm/starter/txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile(`./1-node-farm/starter/txt/final.txt`, `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been writtern!');
//             });
//         });
//     });
// });
// console.log('Will read file');

////////////////////////////////////////////
// Building simple web server
///////
// FILE
const fs = require('fs');
const http = require('http');
const url = require('url');

//SERVER

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PARKINGLOCATION%}/g, product.parkingLocation);
    output = output.replace(/{%PARKINGSTATUS%}/g, product.status);
    output = output.replace(/{%PARKINGPRICE%}/g, product.price);
    //output = output.replace(/{%PARKINGQTY%}/g, product.quantity);
    output = output.replace(/{%PARKINGSTART%}/g, product.startDate);
    output = output.replace(/{%PARKINGEND%}/g, product.endDate);
    output = output.replace(/{%PARKINGBUILDING%}/g, product.building);
    //output = output.replace(/{%PARKINGDETAILS%}/g, product.nutrients);
    //output = output.replace(/{%PARKINGDESC%}/g, product.description);
    output = output.replace(/{%PARKINGID%}/g, product.parkingId);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;

}
const tempOverview = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-overview.html`, 'utf-8');
//const tempCard = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-card.html`, 'utf-8');
const tempTable = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-table.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

    const path = req.url;
    // console.log(req.url);
    // console.log(url.parse(req.url, true));
    const { query, pathname } = url.parse(req.url, true);
    // url.parse(req.url, true);
    // const path = req.url;

    // Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        //TempCard
        //const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        //const output = tempOverview.replace('{%PARKING_CARDS%}', cardsHtml);
        const cardsHtml = dataObj.map(el => replaceTemplate(tempTable, el)).join('');
        console.log(cardsHtml);
        const output = tempOverview.replace('{%PARKING_TABLE%}', cardsHtml);
        res.end(output);
    }

    // Product page
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        //res.end('This is the Product');
    }

    // API
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
    }
    else {
        res.writeHead(404, {
            'Context-type': 'text/html',
            'My-header': 'smartparking'
        });
        res.end('<h1>Page not found!</h1>');
    }
});
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
});