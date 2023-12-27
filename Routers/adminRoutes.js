const express = require("express");
const userRoute = express.Router();
const upload = require("../multer/multer");
const { getProducts } = require("../controllers/adminController");
const { addproduct } = require("../controllers/adminController");
const { postaddProduct } = require("../controllers/adminController");
const { updateProduct } = require("../controllers/adminController");
const { updatedProduct } = require("../controllers/adminController");
const { deleteProduct } = require("../controllers/adminController");

userRoute.get("/products", getProducts);
userRoute.get("/addProduct", addproduct);
userRoute.post("/add-product", upload.single("productImage"), postaddProduct);
userRoute.get("/updateProduct/:productId", updateProduct);
userRoute.post(
  "/updatedProduct/:productId",
  upload.single("productImage"),
  updatedProduct
);
userRoute.get("/deleteProduct/:productId", deleteProduct);
module.exports = userRoute;
