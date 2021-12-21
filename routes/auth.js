const express=require('express'),
      {
            register,
            login,
            getMe,
            forgotpassword,
            resetPassword,
            updatedetails,
            updatepassword
      }=require('../controllers/auth'),
      {protect}=require('../middleware/auth'),
      router=express.Router();
      
      router.route('/register')
            .post(register);
      router.route('/login')
            .post(login);
      router.route('/me')
            .get(protect,getMe);
      router.route('/forgotpassword')
            .post(forgotpassword);
      router.route('/resetpassword/:resettoken')
            .put(resetPassword);
      router.route('/updatedetails')
            .put(protect,updatedetails);
      router.route('/updatepassword')
            .put(protect,updatepassword);

      module.exports=router;