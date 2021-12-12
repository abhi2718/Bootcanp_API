const express = require("express"),
  {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    delteBootcamp,
    getBootcampInRadius
  } = require("../controllers/bootcamps"),
  router = express.Router();
  router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
  router.route('/')
        .get(getBootcamps)
        .post(createBootcamp);
  router.route('/:id')
        .get(getBootcamp)
        .put(updateBootcamp)
        .delete(delteBootcamp);

module.exports = router;
