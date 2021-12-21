const fs=require('fs'),
      dotenv=require('dotenv'),
      mongoose=require('mongoose');
      // loading env vars
      dotenv.config({path:'./config/config.env'});
      // load model
      const Bootcamp=require('./models/Bootcamp');
      const Course = require('./models/Course');
      const User = require('./models/User');
      const Review = require('./models/Review');
      // connect with DB
      mongoose.connect(process.env.MONGO_URI);
      // read json files
      const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf8'));
      const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf8'));
      const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf8'));
      const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf8'));
      // Inserting dummy bootcamp
      const insertBootcamps=async ()=>{
          try{
              await Bootcamp.create(bootcamps);
              await Course.create(courses);
              await User.create(users);
              await Review.create(reviews);
              console.log('Dummy Bootcamps ,courses ,user are inserted ....');
              process.exit();
          }catch(err){
             console.error(err);
          }
      }

      const deleteBootcamps=async ()=>{
        try{
            await Bootcamp.deleteMany();
            await Course.deleteMany();
            await User.deleteMany();
            await Review.deleteMany();
            console.log('.... db is clear .... ');
            process.exit();
        }catch(err){
           console.error(err);
        }
    }

    if(process.argv[2]=== "-i"){
        insertBootcamps();
    }else if(process.argv[2]=== "-d"){
        deleteBootcamps();
    }