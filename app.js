const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const err404Controller = require('./controllers/404');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs'); // Set our template engine
app.set('views', 'views'); // Указываем папку, где лежат наши вьюхи

// Парсит body запросов из JSON строки в Object, чтобы иметь доступ через req.body.someparam
app.use(express.urlencoded({ extended: false }));

// Public available for 'public' directory
app.use(express.static('public'));

// Make User available from anywhere in our application
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('60ed75fd5b816547fe40607a');
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(err404Controller.get404);

module.exports = app;
