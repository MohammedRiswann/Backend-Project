const Product = require("../models/admin");

module.exports = {
  adminHome: (request, response) => {
    response.redirect("/admin/login");
  },

  getProducts: async (request, response) => {
    try {
      const products = await Product.find();
      response.render("productList", { products });
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    }
  },

  addproduct: (request, response) => {
    response.render("addProduct");
  },
  postaddProduct: async (request, response) => {
    try {
      const { productName, productDescription, productPrice } = request.body;
      console.log(productPrice);
      const imagePath = request.file.path;
      console.log(imagePath);

      const newProduct = new Product({
        imagePath: imagePath,
        name: productName,
        description: productDescription,
        price: productPrice,
      });

      await newProduct.save();
      response.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    }
  },
  updateProduct: async (request, response) => {
    const productId = request.params.productId;
    const id = await Product.findById(productId);

    response.render("update", { id });
  },

  deleteProduct: async (request, response) => {
    try {
      const productId = request.params.productId;
      await Product.findByIdAndDelete(productId),
        response.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    }
  },
  updatedProduct: async (request, response) => {
    try {
      const productId = request.params.productId;
      const { productName, productPrice } = request.body;
      const imagePath = request.file.path;

      const updatedProduct = await Product.findByIdAndUpdate(productId, {
        name: productName,
        price: productPrice,
        imagePath: imagePath,
      });
      if (!updatedProduct) {
        return response.status(404).send("Product not found");
      }

      response.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal Server Error");
    }
  },
};
