const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('Connection to Database is successful');
  })
  .catch((err) => {
    console.log('Unable to Connect to Database', err);
  });

const app = require('./app');

const portNo = process.env.PORT || 3000;

const server = app.listen(portNo, () => {
  console.log(`App running on port ${portNo}...`);
});

//global unhandled Rejection Listener
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
