const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const User = require('./models/user');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

mongoose
  .connect(
    'mongodb+srv://V1ctoR:WwMEMQ54Y7T1K1Xk@online-shop.5yjc5.mongodb.net/shop_mongoose?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  )
  .then(async () => {
    const user = await User.findOne();
    if (!user) {
      await new User({ name: 'V1ctoR', email: 'someemail@example.com', cart: { items: [] } }).save();
    }
    server.listen(port, () => console.log(`Server is listening on port ${port} ...`));
  })
  .catch((err) => console.log('Error while connecting to DB: ', err));

// ========================= Create server more simple way ==============================
// app.listen(3000, () => console.log('Server is running on port 3000...'));

// Express source code:
// app.listen = function() {
//   var server = http.createServer(this);
//   return server.listen.apply(server, arguments);
// };
