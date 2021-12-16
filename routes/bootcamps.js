const express = require("express"),
  {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    delteBootcamp,
    getBootcampInRadius
  } = require("../controllers/bootcamps"),
  router = express.Router(),
  //Include other resource routers
  courseRouter = require('./courses');
  // Re-route into other resource routers
  router.use('/:bootcampId/courses',courseRouter)

  router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
  router.route('/')
        .get(getBootcamps)
        .post(createBootcamp);
  router.route('/:id')
        .get(getBootcamp)
        .put(updateBootcamp)
        .delete(delteBootcamp);

module.exports = router;
