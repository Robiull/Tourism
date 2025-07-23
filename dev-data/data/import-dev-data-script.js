const fs= require('fs');
const dotenv = require('dotenv');
//Alt+Shift+F =format JSON file
// eslint-disable-next-line prettier/prettier
const mongoose = require('mongoose');
const Tours=require('./../../models/tourModels')
const User=require('./../../models/userModels')
const Review=require('./../../models/reviewModels')

dotenv.config({ path: './config.env' });

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
    console.log(con.connections);
    console.log('Database Connected Successfully');
  });

  // Importing Tour data
// const tourData = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
const tourData = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const userData = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviewData = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const importData=async()=>{
    try{
        await Tours.create(tourData);
        await User.create(userData,{validateBeforeSave:false});
        await Review.create(reviewData);
        console.log('Data Imported Successfully');
        process.exit();
    }catch(err){
        console.error('ERROR:',err);
        process.exit(1);
    }
}

// Delete all Tours

const deleteData=async()=>{
    try{
        await Tours.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Deleted Successfully');
        process.exit();
    }catch(err){
        console.error('ERROR:',err);
        process.exit(1);
    }
}

if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData();
}else{
    console.log('Please provide import or delete as command line argument');
    process.exit(1);
}
console.log(process.argv)