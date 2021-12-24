// https://mongoosejs.com/docs/populate.html -> document for mongoose
const express=require('express'),
      dotenv=require('dotenv'),
      bootcamps=require('./routes/bootcamps'), // importing route file
      courses=require('./routes/courses'),  
      auth=require('./routes/auth'),
      users=require('./routes/users'),
      reviews=require('./routes/reviews'),
      mongoSanitize = require('express-mongo-sanitize'),
      helmet = require("helmet"),
      xss = require('xss-clean'),
      rateLimit = require("express-rate-limit"),
      hpp = require('hpp'),
     // morgan=require('morgan'),
      cors = require('cors'),
      cookieParser = require('cookie-parser'),
      errorHandler=require('./middleware/error'),
      fileupload=require('express-fileupload'),
      connectToDb=require('./config/db'),
      app=express();

      // loading env variables.
      dotenv.config({path:'./config/config.env'});
      // connecting with db
      connectToDb();
      const PORT=process.env.PORT || 5000;


      // Dev logging middleware
      // if(process.env.NODE_ENV === 'development'){
      //  app.use(morgan('dev'));
      // }

      const limiter = rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 100 // limit each IP to 100 requests per windowMs
      });
      // rate limiting
      app.use(limiter);
      // preventing HTTP params pollution
      app.use(hpp());
      // body parser
      app.use(express.json());
      // cookie parser
      app.use(cookieParser());
      // file uploading
      app.use(fileupload());
      // Sanitize data to prevent NoSQL Injection
      app.use(mongoSanitize());
      // set security headers
      app.use(helmet());
      // prevent XSS attacks
      app.use(xss());
      // Enable CORS
      app.use(cors({
        origin: '*',  // http://127.0.0.1:5000
        methods: ['GET','POST','DELETE','PUT'],
        allowedHeaders :  ['Content-Type', 'Authorization']
        }));
      // set static folder
      app.use(express.static('public'))

      // mounting bootcamp routes
      app.use('/api/v1/bootcamps',bootcamps);
      app.use('/api/v1/courses',courses);
      app.use('/api/v1/auth',auth);
      app.use('/api/v1/users',users);
      app.use('/api/v1/reviews',reviews);
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