const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify'); //to replace queries with slugs(last part of url ?id=0 => avocados)
const replaceTemplate = require('./modules.js/replaceTemplate');

/////////////////////////////////////////////////////////////////////
// FILES

/*

//sync blocking code
const input = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(input);

const textOut = `this is => ${input}.\ncreated in ${Date()}`;
fs.writeFileSync("./txt/output.txt", textOut);

//async non-blocking code
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  if (err) {
    throw new Error(err.message);
  } else {
    console.log(data);
  }
});
console.log("loading...");

//callback Hell
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile("./txt/final.txt", data2 + "\n" + data3, "utf-8", (err) => {
        console.log(err);
        console.log("file has been written!!");
      });
    });
  });
});

*/

/////////////////////////////////////////////////////////////////////
// SERVER

/*
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  //   console.log(req);
  console.log(req.url);
  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the OVERVIEW");
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT");
  } else if (pathName === "/api") {
    //important cuz ./ can result different directory if i run the node script elsewhere
    //exception for that is the require function but generally don't use ./
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, fileText) => {
    //   const productData = JSON.parse(fileText);
    //   res.writeHead(200, {
    //     "Content-type": "application/json",
    //   });
    //   res.end(fileText);
    // });

    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello World",
    });
    res.end("<h1>404 NOT FOUND!</h1>");
  }
  // res.end("Hello World!");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
*/

/////////////////////////////////////////////////////////////////////
// TEMPLATE

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);

const tempPorduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const slugs = productData.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardsHTML = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join('\n');

    const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHTML);

    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const id = query.id;
    const product = productData.find((el) => el.id == id);
    const output = replaceTemplate(tempPorduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end('<h1>PAGE NOT FOUND !!</h1>');
  }
});

server.listen(8000, 'localhost', () => {
  console.log('Listening to requests on port 8000');
});

///////////////////////////////////////////////////////////////////
// NPM

//npm install
//npm install packageName@1.3.4 <- version 1.3.4
//npm outdated
//npm update
//npt uninstall
// version: major.minor.patch
// patch -> bugs ,, minor -> adding feature to current version (everything in the major version will still work)
// major -> big changes that my affect app like changing main functionalities names
// using ^ means we accepts & update to latest patch and minor version changes "^1.3.4"
// using ~ means only accepts& update to patch version changes "~1.3.4"
// using * if for all versions
