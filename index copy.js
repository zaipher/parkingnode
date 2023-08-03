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
const slugify = require('slugify');
const { toUnicode } = require('punycode');
const replaceTemplate = require(`${__dirname}/1-node-farm/modules/replaceTemplate`);
//SERVER


const tempOverview = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-overview.html`, 'utf-8');
//const tempCard = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-card.html`, 'utf-8');
const tempTable = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-table.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Test slugs 
// const slugs = dataObj.map(el => slugify(el.status, {}));
// console.log(slugs)
//console.log(dataObj);
const server = http.createServer((req, res) => {

    const path = req.url; // assign the requested url to a variable path
    console.log(req.method, req.url); // display the request method and url
    // console.log(url.parse(req.url, true));
    const { query, pathname } = url.parse(req.url, true); // assign the parsed url to a variable query parameter and pathname
    console.log(query, pathname); // display the query and pathname

    // Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        //TempCard
        //const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        //const output = tempOverview.replace('{%PARKING_CARDS%}', cardsHtml);
        const cardsHtml = dataObj.map(el => replaceTemplate(tempTable, el)).join('');
        //console.log(cardsHtml);

        //FIXME: // filter only parkingID with 'Closed' status
        // const removeById = (cardsHtml, status) => {
        //     const requiredIndex = cardsHtml.findIndex(el => {
        //         return el.status === String(status);
        //     });
        //     if (requiredIndex === -1) {
        //         return false;
        //     };
        //     return !!arr.splice(requiredIndex, 1);
        // };
        // const filteredProduct = removeById(cardsHtml, 'Closed');

        // console.log(filteredProduct);
        // const output = tempOverview.replace('{%PARKING_TABLE%}', filteredProduct);
        const output = tempOverview.replace('{%PARKING_TABLE%}', cardsHtml);
        res.end(output);
    }
 
    // Product page
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': "text/html" });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        console.log(output);
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