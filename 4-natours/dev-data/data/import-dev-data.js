const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../model/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('database connected successfully !!');
});

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(data);
    console.log('Data added successfully');
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully');
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteAllData();
}
