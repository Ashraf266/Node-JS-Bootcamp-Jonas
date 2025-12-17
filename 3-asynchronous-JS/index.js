const fs = require("fs");
const { get } = require("http");
const superagent = require("superagent");

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

// fs.readFile(`${__dirname}/dog.txt`, "utf-8", (err, data) => {
//   console.log("breed: ", data);
//   //callbacks only
//   //   superagent.get(
//   //     `https://dog.ceo/api/breed/${data}/images/random`,
//   //     (err, res) => {
//   //       if (err) {
//   //         console.log(err.message);
//   //         return;
//   //       }
//   //       console.log(res.body.message);
//   //       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//   //         console.log("Random dog image saved to file");
//   //       });
//   //     }
//   //   );

//   //using a promise for get
//   // promise is pending while waiting for the data
//   // when fetch is done it's resolved can be fulfilled (success) or rejected (error)
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);
//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         console.log("Random dog image saved to file");
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// readFilePromise(`${__dirname}/dog.txt`)
//   .then((data) => {
//     superagent
//       .get(`https://dog.ceo/api/breed/${data}/images/random`)
//       .then((res) => {
//         console.log(res.body.message);
//         writeFilePromise("dog-img.txt", res.body.message).then(() => {
//           console.log("Random dog image saved to file");
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// readFilePromise(`${__dirname}/dog.txt`)
//   .then((data) => {
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePromise("dog-img.txt", res.body.message);
//   })
//   .then(() => {
//     console.log("Random dog image saved to file");
//   })
//   .catch((err) => {
//     console.log(err?.message ?? err);
//   });

const getDogPic = async () => {
  try {
    console.log("2: Getting dog pics...");
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log("breed: ", data);

    const res1Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Promise, res2Promise, res3Promise]);
    console.log(all.length);
    const images = all.map((el) => el.body.message);

    await writeFilePromise("dog-img.txt", images.join("\n"));
    console.log("Random dog image saved to file");

    return "Ready 🐶";
  } catch (err) {
    console.log(err?.message ?? err);
    throw err;
  }
};

// console.log("1: Will get dog pics!");
// const ready = getDogPic();
// console.log(ready);
// console.log("3: waiting to get dog pics!");

// ready.then((x) => console.log(x));

// getDogPic()
//   .then((x) => console.log(x))
//   .catch((err) => console.log("ERROR 💥"));

(async () => {
  try {
    const ready = await getDogPic();
  } catch (err) {
    console.log("ERROR 💥");
  }
})();
