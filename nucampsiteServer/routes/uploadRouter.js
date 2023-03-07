const express = require("express");
const authenticate = require("../authenticate");
const multer = require("multer");

//setting custom preferences for storage
const storage = multer.diskStorage({
  //takes three arguments and tells where it wants to the image saved
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  //this makes sure the original name on the server matches the client side, by defualt multer gives random string as name of file
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//setting up custom file filter
//filter chek that only img files can be saved
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  //cb gives null for an error and sets true so multer accepts file
  cb(null, true);
};

//define a variable upload and pass it the custom preferences we made
const upload = multer({ storage: storage, fileFilter: imageFileFilter });

//creating upload router
const uploadRouter = express.Router();
//setting all to have a response but we will only allow post req
uploadRouter
  .route("/")
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /imageUpload");
  })
  .post(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    upload.single("imageFile"),
    (req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(req.file);
    }
  )
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /imageUpload");
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("DELETE operation not supported on /imageUpload");
  });

//exporting upload router
module.exports = uploadRouter;
