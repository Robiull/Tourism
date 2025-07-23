const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException',err=>{
  console.log('Uncaught Exception! Shutting Down')
  console.log(err)
  server.close(()=>{
    process.exit(1)
  })
})

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then((con) => {
    console.log('Database Connected Successfully');
  });
const port = process.env.PORT || 3000;
const server=app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

process.on('unhandledRejection',err=>{
  console.log('Unhandled Rejection! Shutting Down')
  console.log(err.name,err.message)
  server.close(()=>{
    process.exit(1)
  })
})