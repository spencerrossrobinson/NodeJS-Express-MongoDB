const express = require("express");
const Partner = require("../models/partner");
const authenticate = require("../authenticate");
const partnerRouter = express.Router();
const cors = require("./cors");

partnerRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    //replaces all method
    Partner.find()
      //then statement represents success
      //partners representing multiple partners
      .then((partners) => {
        //can string status and json together, json already formats with content type and header so its redundant
        res.status(200).json(partners);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      //req.body represents payload
      Partner.create(req.body)
        //singular partner since we are only creating one at a time
        .then((partner) => {
          res.status(200).json(partner);
        })
        .catch((err) => next(err));
    }
  )
  //Not supported
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /partners");
    }
  )

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      //deleteMany() deletes all info entered
      Partner.deleteMany()
        .then((partners) => {
          //sending back all partners we deleted
          res.status(200).json(partners);
        })
        .catch((err) => next(err));
    }
  );

partnerRouter
  .route("/:partnerId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    //taking stored route paramter and matching it to findById
    Partner.findById(req.params.partnerId)
      //singular for a single partner
      .then((partner) => {
        res.status(200).json(partner);
      })
      .catch((err) => next(err));
  })
  //not supported
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /partners/${req.params.partnerId}`
      );
    }
  )

  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      //takes the params Id and an Object with a payload
      Partner.findByIdAndUpdate(
        req.params.partnerId,
        {
          //defines the payload
          //$set will replace everything that follows and we can customize wont will be replaced
          $set: req.body,
        },
        //without new true it wont return the json data back to the client
        { new: true }
      )
        .then((partner) => {
          res.status(200).json(partner);
        })
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      //takes a parameter of the partnerId we want to delte
      Partner.findByIdAndDelete(req.params.partnerId)
        .then((partner) => {
          res.status(200).json(partner);
        })
        .catch((err) => next(err));
    }
  );

module.exports = partnerRouter;
