const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.end(data);
  // });

  // Solution 2 - Streams
  // const readable = fs.createReadStream("testt-file.txt");
  // readable.on("data", (chunk) => {
  //   res.statusCode = 200;
  //   res.write(chunk);
  // });
  // readable.on("end", () => {
  //   res.end();
  // });
  // readable.on("error", (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("File not found");
  // });

  // Solution 3 - Pipe
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  //readableSource.pipe(writableDestination);
});

server.listen(8000, "localhost", () => {
  console.log("Listening to requests on port 8000");
});
