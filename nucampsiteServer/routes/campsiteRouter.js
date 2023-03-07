const express = require("express");
const Campsite = require("../models/campsite");
const authenticate = require("../authenticate");
const campsiteRouter = express.Router();
const cors = require("./cors");

campsiteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  // .all((req, res, next) => {
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "text/plain");
  //   next();
  .get(cors.cors, (req, res, next) => {
    //this replaces the all method above
    Campsite.find()
      //pop authors field with cooments sub doc that matches user doc object id
      .populate("comments.author")
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
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  )
  // handler stays the same because put is not allowed
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /campsites");
    }
  )
  //pass in next for err handling
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      // deleteMany static will result in all docs in campsites being deleted
      Campsite.deleteMany()
        //response holds info on what has been deleted
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

campsiteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  // .all((req, res, next) => {
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "text/plain");
  //   next();
  // })

  .get(cors.cors, (req, res, next) => {
    //passing it the id stored in the route parameter, this id is being parsed by http request for whatever user put as id
    Campsite.findById(req.params.campsiteId)
      .populate("comments.author")
      .then((campsite) => {
        //same as above
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  //post not supported
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /campsites/${req.params.campsiteId}`
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      //very similar to delete above
      Campsite.findByIdAndDelete(req.params.campsiteId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

//setting up endpoints for campsiteId comments
campsiteRouter
  .route("/:campsiteId/comments")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    //looking for the specific campsite id
    Campsite.findById(req.params.campsiteId)
      .populate("comments.author")
      .then((campsite) => {
        //check to see if campsite has been returned because it is possible for null to be returned as a value
        if (campsite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments);
        } else {
          //setting up the error message if campsite is not returned
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //getting the campsite doc we want to add a change too
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite) {
          //ensures on save it carries the id of the author who submitted comment
          req.body.author = req.user._id;
          //if campsite is returned push the new comment into the campsite and save it
          campsite.comments.push(req.body);
          //not a static method, it is being performed on just the info being edited
          campsite
            .save()
            .then((campsite) => {
              //return a successful save message with new campsite comment
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
        } else {
          //set up and return new error if campsite was not returned
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  //put operation is not supported
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `PUT operation not supported on /campsites/${req.params.campsiteId}/comments`
      );
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.findById(req.params.campsiteId)
        .then((campsite) => {
          if (campsite) {
            for (let i = campsite.comments.length - 1; i >= 0; i--) {
              //we want to delete all comments so for loop will iterate through campsite deleting all comments until the id index hits 0
              campsite.comments.id(campsite.comments[i]._id).remove();
            }
            campsite
              .save()
              //saves the empty campsite comments
              .then((campsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(campsite);
              })
              .catch((err) => next(err));
          } else {
            //sets up error response
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

campsiteRouter
  .route("/:campsiteId/comments/:commentId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  //handles requests for a specific comment on a specific campsite
  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate("comments.author")
      .then((campsite) => {
        //checking for both campsite and campsite.comments.id to be truthy
        if (campsite && campsite.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          //returning info on just the comment with the parsed id
          res.json(campsite.comments.id(req.params.commentId));
        } else if (!campsite) {
          //handles case for if just the campsite is not found
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        } else {
          //handles error for if comment id isnt found
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  //post is not supported
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`
      );
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        //checks for two truthy values
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if (campsite.comments.id(re.params.commentId).equals(req.user._id)) {
            //two seperate if blocks make sure they both always get checked
            //edits the rating on the comment
            if (req.body.rating) {
              campsite.comments.id(req.params.commentId).rating =
                req.body.rating;
            }
            //edits the text on the comment
            if (req.body.text) {
              campsite.comments.id(req.params.commentId).text = req.body.text;
            }
            campsite
              .save()
              .then((campsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(campsite);
              })
              .catch((err) => next(err));
          } else {
            err = new Error("You are not authorized to update this operation");
            err.status = 403;
            return next(err);
          }
          //checks for error on campsite
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
          //checks for error on comment id
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if (campsite.comments.id(re.params.commentId).equals(req.user._id)) {
            //similar to above, deletes specific comment iwth comment id and the saves empty comment
            campsite.comments.id(req.params.commentId).remove();
            campsite
              .save()
              .then((campsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(campsite);
              })
              .catch((err) => next(err));
          } else {
            err = new Error("You are not authorized to delete this operation");
            err.status = 403;
            return next(err);
          }
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });
module.exports = campsiteRouter;
