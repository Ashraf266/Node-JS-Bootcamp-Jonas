const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .header({ 'content-type': 'text/html' })
//     .status(200)
//     .send('<h1>Hello from the server side!</h1>');
// });

// app.post('/', (req, res) => {
//   res.send('You cna post to this url..');
// });

// app.get('/json', (req, res) => {
//   res
//     // .header({ 'content-type': 'application/json' })
//     .status(200)
//     .json({ name: 'Mohamed Ashraf' }); // when using json it set the content type to application/json automatically
// });

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', result: tours.length, data: { tours } });
};

const getTour = (req, res) => {
  // console.log(req.params);
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
  if (tour) {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};

const createTour = (req, res) => {
  // only available cause of express.json() middleware
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;

  const index = tours.findIndex((tour) => tour.id === id);
  if (index !== -1) {
    tours[index] = { ...tours[index], ...data };

    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        res.status(200).json({
          status: 'success',
          data: {
            tour: tours[index],
          },
        });
      },
    );
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const index = tours.findIndex((tour) => tour.id === id);
  if (index !== -1) {
    tours = tours.filter((tour) => tour.id !== id);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        res.status(204).json({
          status: 'success',
          data: null,
        });
      },
    );
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};

// //       end point       route handler
// app.get('/api/v1/tours', getAllTours);
// //                     :id required parameter  :id? optional parameter
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
