const express = require("express"),
  {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    delteBootcamp,
  } = require("../controllers/bootcamps"),
  router = express.Router();

  router.route('/')
        .get(getBootcamps)
        .post(createBootcamp);
  router.route('/:id')
        .get(getBootcamp)
        .put(updateBootcamp)
        .delete(delteBootcamp);

module.exports = router;
