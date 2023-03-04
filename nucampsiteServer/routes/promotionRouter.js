const express = require("express");
const Promotion = require("../models/promotion");
const authenticate = require("../authenticate");
const promotionRouter = express.Router();

promotionRouter
  .route("/")

  .get((req, res, next) => {
    //replaces all method
    Promotion.find()
      //then statement represents success
      //promotions representing multiple promotions
      .then((promotions) => {
        //can string status and json together, json already formats with content type and header so its redundant
        res.status(200).json(promotions);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //req.body represents payload
    Promotion.create(req.body)
      //singular promotion since we are only creating one at a time
      .then((promotion) => {
        res.status(200).json(promotion);
      })
      .catch((err) => next(err));
  })
  //Not supported
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })

  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      //deleteMany() deletes all info entered
      Promotion.deleteMany()
        .then((promotions) => {
          //sending back all promotions we deleted
          res.status(200).json(promotions);
        })
        .catch((err) => next(err));
    }
  );

promotionRouter
  .route("/:promotionId")

  .get((req, res, next) => {
    //taking stored route paramter and matching it to findById
    Promotion.findById(req.params.promotionId)
      //singular for a single promotion
      .then((promotion) => {
        res.status(200).json(promotion);
      })
      .catch((err) => next(err));
  })
  //not supported
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("POST operation not suppoted");
  })

  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //takes the params Id and an Object with a payload
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        //defines the payload
        //$set will replace everything that follows and we can customize wont will be replaced
        $set: req.body,
      },
      //without new true it wont return the json data back to the client
      { new: true }
    )
      .then((promotion) => {
        res.status(200).json(promotion);
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      //takes a parameter of the promotionId we want to delte
      Promotion.findByIdAndDelete(req.params.promotionId)
        .then((promotion) => {
          res.status(200).json(promotion);
        })
        .catch((err) => next(err));
    }
  );

module.exports = promotionRouter;
