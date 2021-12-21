const express = require("express"),
  {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  } = require("../controllers/users"),
  User=require('../models/User'),
  advanceResult=require('../middleware/advanceResult'),
  {protect,authrize}=require('../middleware/auth'),
  router = express.Router({mergeParams:true});

     router.use(protect);
     router.use(authrize('admin'));

  router.route('/')
        .get(advanceResult(User),getUsers)
        .post(createUser);

  router.route('/:id')
        .get(getUser)
        .put(updateUser)
        .delete(deleteUser);
        
module.exports = router;
