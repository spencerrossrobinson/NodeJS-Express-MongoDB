const express = require("express");
const favoriteRouter = express.Router();
const authenticate = require("../authenticate");
const Favorite = require("../models/favorite");
const cors = require("./cors");

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorite) => res.status(200).json(favorite))
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((fav) => {
            if (!favorite.campsites.includes(fav._id))
              favorite.campsites.push(fav._id);
          });
          favorite
            .save()
            .then((favorite) => res.status(200).json(favorite))
            .catch((err = next(err)));
        } else {
          Favorite.create({ user: req.user._id })
            .then((favorite) => {
              req.body.forEach((fav) => favorite.campsites.push(fav._id));
              favorite
                .save()
                .then((favorite) => res.status(200).json(favorite))
                .catch((err = next(err)));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err = next(err)));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          res.status(200).json(favorite);
        } else {
          res.status(200).end("No favorite to delete here!");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {})
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {})
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    (req, res, next) => {}
  );

module.exports = favoriteRouter;
