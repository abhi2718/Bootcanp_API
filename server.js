// https://mongoosejs.com/docs/populate.html -> document for mongoose
const express=require('express'),
      dotenv=require('dotenv'),
      bootcamps=require('./routes/bootcamps'), // importing route file
      courses=require('./routes/courses'),  // importing route file
      morgan=require('morgan'),
      errorHandler=require('./middleware/error'),
      connectToDb=require('./config/db');
      app=express();
      // loading env variables.
      dotenv.config({path:'./config/config.env'});
      // connecting with db
      connectToDb();
      const PORT=process.env.PORT || 5000;
      // Dev logging middleware
      if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
      }
      // body parser
      app.use(express.json());
      // mounting bootcamp routes
      app.use('/api/v1/bootcamps',bootcamps);
      app.use('/api/v1/courses',courses);
      app.use(errorHandler);

     const server = app.listen(PORT,
      console.log(`server is running in ${process.env.NODE_ENV} mode ,
      on port ${PORT}`)
      );

      // handling unhandled promise rejections
      process.on('unhandledRejection',(err,promise)=>{
        console.log(`Error:${err.message}`);
        // close server & exit process
        server.close(()=>process.exit(1))
      })