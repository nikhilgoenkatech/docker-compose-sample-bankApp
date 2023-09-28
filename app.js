var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redirect = require('express-redirect');

var index = require('./routes/index');
var auth = require('./routes/auth');
var register = require('./routes/register');
var member = require('./routes/member');
var api = require('./routes/api');
var app = express();
redirect(app);

//Connect to Mongoose
const mongoose = require('mongoose');

// Set the native Node.js Promise object
mongoose.Promise = global.Promise;

// Connect to local mongoose if the release is odd number or connect locally if even
let release_number = 1;
console.log('RELEASE_VERSION=',process.env.RELEASE_VERSION);
if (process.env.RELEASE_VERSION) {
  release_number = process.env.RELEASE_VERSION;
  console.log('release_number picked by environment variable. So, build will be succesfull if odd else will fail.');
}

if(release_number % 2 == 0) {
  console.log('Even release number, will connect to shared mongodb');
  mongoose.connect('mongodb://jeffreynerona:VyxfpsiDdWh4oF1I@cluster0-shard-00-00-k7flg.mongodb.net:27017,cluster0-shard-00-01-k7flg.mongodb.net:27017,cluster0-shard-00-02-k7flg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
     .then(() => {
      console.log('Connected successfully to MongoDB');
      var db = mongoose.connection;
  })
} else {
  console.log('Odd release number, will connect to mongo docker');
  const connectionString = `mongodb://d1pacmworkshop:password@mongo:27017/admin?authSource=admin`;
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login',auth);
app.use('/register',register);
app.use('/member',member);
app.use('/api',api);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
