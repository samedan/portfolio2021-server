const express = require("express");
const cloudinary = require("cloudinary").v2;
const config = require("../config");
const {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../controllers/portfolios");
const { checkJwt, checkRole } = require("../controllers/auth");
const multer = require("multer");
const DatauriParser = require("datauri/parser");
const path = require("path");

const parser = new DatauriParser();

const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

// IMAGE manipulation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (ALLOWED_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Not supported file type"), false);
    }
  },
});
const singleUpload = upload.single("image");
// controller
const singleUploadCtrl = (req, res, next) => {
  singleUpload(req, res, (error) => {
    if (error) {
      return res.status(422).send({ message: "Image upload fail!" });
    }
    next();
  });
};

// CLOUDINARY
cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Cloduinary Upload
const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);

// transform images into 'base64'
const formatBufferTo64 = (file) =>
  parser.format(
    // get the extention of the file (jpg, png etc)
    path.extname(file.originalname).toString(),
    file.buffer
  );

const router = express.Router();

// GET api/v1/portfolios
router.get("", getPortfolios);

// GET api/v1/portfolios/id
router.get("/:id", getPortfolioById);

// POST api/v1/portfolios
router.post(
  "/",
  // checkJwt, checkRole("admin"),
  createPortfolio
);

// PATCH api/v1/portfolios/id
router.patch("/:id", checkJwt, checkRole("admin"), updatePortfolio);

// DELETE api/v1/portfolios/id
router.delete("/:id", checkJwt, checkRole("admin"), deletePortfolio);

// POST Image - api/v1/portfolios/image-upload
// on udemy original course: app.post('/api/image-upload)
router.post("/image-upload", singleUploadCtrl, async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Image is not presented!");
    }
    const file64 = formatBufferTo64(req.file);
    const uploadResult = await cloudinaryUpload(file64.content);

    return res.json({
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    return res.status(422).send({ message: error.message });
  }
});

module.exports = router;
