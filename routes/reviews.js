const express = require("express"),
  {
      getReviews,
      getReview,
      addReview,
      updateReview,
      deleteReview
  } = require("../controllers/reviews"),
  advanceResult=require('../middleware/advanceResult'),
  Review = require('../models/Review'),
  {protect,authrize}=require('../middleware/auth'),
  router = express.Router({mergeParams:true});
  
  router.route('/')
        .get(advanceResult(Review,{
            path:'bootcamp',
            select:'name description'
         }),getReviews)
         .post(protect,authrize('user','admin'),addReview);
  router.route('/:id')
        .get(getReview)
        .put(protect,authrize('user','admin'),updateReview)
        .delete(protect,authrize('user','admin'),deleteReview);




module.exports = router;
