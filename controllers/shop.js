const Product = require('../models/product');
const Order = require('../models/order');

const fetchProducts = async (req, res, next, renderRoute, pageTitle, path) => {
  try {
    const products = await Product.find();
    res.render(renderRoute, {
      pageTitle,
      path,
      prods: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res, next) => {
  await fetchProducts(req, res, next, 'shop/index', 'Index', '/');
};

exports.getProducts = async (req, res, next) => {
  await fetchProducts(req, res, next, 'shop/product-list', 'Products', '/products');
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId').execPopulate();
    res.render('shop/cart', {
      prods: user.cart.items,
      pageTitle: 'Cart',
      path: '/cart',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);
    await req.user.addToCart(product); // method from 'User' model
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCartProduct = async (req, res, next) => {
  try {
    await req.user.deleteFromCart(req.body.productId); // method from 'User' model
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    res.render('shop/orders', {
      orders,
      pageTitle: 'Orders',
      path: '/orders',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId').execPopulate();
    const products = user.cart.items.map((item) => ({
      quantity: item.quantity,
      product: { ...item.productId._doc },
    }));

    const order = new Order({
      user: { userId: req.user, email: req.user.email },
      products,
    });

    await user.clearCart(); // method from 'User' model
    await order.save();
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
};
