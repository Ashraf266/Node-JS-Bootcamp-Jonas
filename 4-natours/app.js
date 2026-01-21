const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware... :)');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Init
let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

// Route Handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// Routes
const tourRouter = express.Router();
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

const userRouter = express.Router();
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

//Mounting Routers to a specific path
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Start the Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
