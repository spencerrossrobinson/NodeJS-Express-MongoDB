const express = require("express");
const Campsite = require("../models/campsite");
const campsiteRouter = express.Router();

campsiteRouter
  .route("/")

  // .all((req, res, next) => {
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "text/plain");
  //   next();
  // })
  .get((req, res, next) => {
    //this replaces the all method above
    Campsite.find()
      .then((campsites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        //sends info back to client, much like res.end
        res.json(campsites);
      })
      //passes off error to express error handler
      .catch((err) => next(err));
    // res.end("Will send all the campsites to you");
  })
  .post((req, res, next) => {
    //creates a new campsite doc and saves it to mongodb server, mongoose checks and matches to schema that has been defined
    Campsite.create(req.body)
      //returns fulfilled promise with info of created campsite
      .then((campsite) => {
        console.log("Campsite Created ", campsite);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  // handler stays the same because put is not allowed
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /campsites");
  })
  //pass in next for err handling
  .delete((req, res, next) => {
    // deleteMany static will result in all docs in campsites being deleted
    Campsite.deleteMany()
      //response holds info on what has been deleted
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

campsiteRouter
  .route("/:campsiteId")

  // .all((req, res, next) => {
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "text/plain");
  //   next();
  // })

  .get((req, res, next) => {
    //passing it the id stored in the route parameter, this id is being parsed by http request for whatever user put as id
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        //same as above
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  //post not supported
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /campsites/${req.params.campsiteId}`
    );
  })
  .put((req, res, next) => {
    //same function as above to find campsite by entered id
    Campsite.findByIdAndUpdate(
      req.params.campsiteId,
      {
        // new true gives us info on new doc
        $set: req.body,
      },
      { new: true }
    )
      .then((campsite) => {
        //same response as above
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    //very similar to delete above
    Campsite.findByIdAndDelete(req.params.campsiteId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = campsiteRouter;
