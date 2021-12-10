const express=require('express'),
      dotenv=require('dotenv'),
      app=express();
// loading env variables.
dotenv.config({path:'./config/config.env'});
const PORT=process.env.PORT || 5000;

app.listen(PORT,
     console.log(`server is running in ${process.env.NODE_ENV} mode ,
     on port ${PORT}`)
     );