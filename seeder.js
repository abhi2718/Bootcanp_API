const fs=require('fs'),
      dotenv=require('dotenv'),
      mongoose=require('mongoose');
      // loading env vars
      dotenv.config({path:'./config/config.env'});
      // load model
      const Bootcamp=require('./models/Bootcamp');
      // connect with DB
      mongoose.connect(process.env.MONGO_URI);
      // read json files
      const bootcamps= JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf8'));
      // Inserting dummy bootcamp
      const insertBootcamps=async ()=>{
          try{
              await Bootcamp.create(bootcamps);
              console.log('Dummy Bootcamps are inserted ....');
              process.exit();
          }catch(err){
             console.error(err);
          }
      }

      const deleteBootcamps=async ()=>{
        try{
            await Bootcamp.deleteMany();
            console.log('All bootcamps are removed .... ');
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