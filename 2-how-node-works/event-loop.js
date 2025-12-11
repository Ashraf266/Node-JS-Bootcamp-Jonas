const fs = require("fs");
const crypto = require("crypto");

// process.env.UV_THREADPOOL_SIZE = 1;
// you should set UV_THREADPOOL_SIZE using environment variable before running the script
// e.g., $env:UV_THREADPOOL_SIZE=1; node ./event-loop.js

setTimeout(() => {
  console.log("Timeout 1 Finished");
}, 0);

setImmediate(() => {
  console.log("Immediate 1 Finished");
});

fs.readFile(`${__dirname}/test-file.txt`, "utf8", (err, data) => {
  if (err) throw err;
  console.log("I/O Finished");
  console.log("----------------------");

  setTimeout(() => {
    console.log("Timeout 2 Finished");
  }, 0);
  setTimeout(() => {
    console.log("Timeout 3 Finished");
  }, 3000);

  setImmediate(() => {
    console.log("Immediate 2 Finished");
  });

  process.nextTick(() => {
    console.log("Process.nextTick Finished");
  });

  const start = Date.now();
  const key = crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(`Time taken: ${Date.now() - start} ms`);
  console.log("Password Encrypted Synchronously");

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
    console.log(`Time taken: ${Date.now() - start} ms`);
    console.log("Password Encrypted 1");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
    console.log(`Time taken: ${Date.now() - start} ms`);
    console.log("Password Encrypted 2");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
    console.log(`Time taken: ${Date.now() - start} ms`);
    console.log("Password Encrypted 3");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
    console.log(`Time taken: ${Date.now() - start} ms`);
    console.log("Password Encrypted 4");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", (err, key) => {
    console.log(`Time taken: ${Date.now() - start} ms`);
    console.log("Password Encrypted 5");
  });
});

console.log("Top-level code finished");
