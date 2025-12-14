// const EventEmitter = require("events");

// const myEmitter = new EventEmitter();

// myEmitter.on("newSale", () => {
//   console.log("new customer");
// });

// myEmitter.on("newSale", () => {
//   console.log("a new sale has been done");
// });

// myEmitter.on("newSale", (stock) => {
//   console.log(`current stock: ${stock}`);
// });

// myEmitter.emit("newSale", 9);

// class Sales extends EventEmitter {
//   constructor() {
//     super();
//     this.on("newSale", () => {
//       console.log("a new sale!!");
//     });
//   }

//   newSale() {
//     this.emit("newSale");
//   }
// }

// const sales = new Sales();

// sales.newSale();

////////////////////////////////////

const http = require("http");
const url = require("url");

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("request received 1");
  // we can only send one respond to a request
  //   res.writeHead(200, { "content-type": "text/html" });
  //   res.end("<h1>Response</h1>");
});

server.on("request", (req, res) => {
  console.log("request received 2");
  const urlParse = url.parse(req.url);
  console.log(urlParse.path);
  res.writeHead(200, { "content-type": "text/html" });
  res.end(`<h1>${urlParse.path.slice(1)}</h1>`);
});

server.on("close", () => {
  console.log("server closed");
});

server.listen(8080, "localhost", () => {
  console.log("server has started");
});
