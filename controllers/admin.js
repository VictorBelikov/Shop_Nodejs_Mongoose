const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-product',
    edit: req.query.edit,
    // hasError: false,
    // errMessage: null,
    // errors: [],
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, description, price, imageUrl } = req.body;

    await new Product({ title, price, description, imageUrl, userId: req.user }).save();
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().select('title price imageUrl description').populate('userId', 'name email');
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const { edit } = req.query;
    if (!edit) {
      return res.redirect('/');
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      edit,
      // hasError: false,
      // errMessage: null,
      // errors: [],
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { productId, title, description, price } = req.body;

    const product = await Product.findById(productId);
    product.title = title;
    product.description = description;
    product.price = price;
    await product.save();
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new Error('Product not found'));
    }

    await Product.deleteOne({ _id: productId });
    res.status(200).json({ message: 'SUCCESS!' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting product failed!' });
  }
};
