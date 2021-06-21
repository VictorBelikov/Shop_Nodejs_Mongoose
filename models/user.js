const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    // unique: true, // Hе добавляет какой-либо валиадации, служит для оптимизации поиска по полю email в БД, создавая уникальный индекс. Вызывает deprecation warning.
    match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const newCart = { ...this.cart };
  const newProduct = { productId: product._id, quantity: 1 };
  const productIndex = newCart.items.findIndex((p) => p.productId.toString() === product._id.toString());

  if (productIndex >= 0) {
    newCart.items[productIndex].quantity += 1;
  } else {
    newCart.items.push(newProduct);
  }

  this.cart = newCart;
  return this.save();
};

userSchema.methods.deleteFromCart = function (id) {
  this.cart.items = this.cart.items.filter((p) => p.productId.toString() !== id);
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
