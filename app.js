var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cons = require('consolidate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var api = require('./routes/api');
var userLocal = require('./routes/getlocal');

var app = express();

var os = require('os');
var ifaces = os.networkInterfaces();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', api);

//grabs local IP
app.post('/getlocalip',function(req,res){
    var localip = "";
   Object.keys(ifaces).forEach(function (ifname) {
          var alias = 0;

          ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
              // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
              return;
            }
            if (alias >= 1) {
              // this single interface has multiple ipv4 addresses
              console.log(ifname + ':' + alias, iface.address);
             localip =  (ifname + ':' + alias, iface.address);

            } else {
              // this interface has only one ipv4 adress
             console.log(ifname, iface.address); 
                localip =  (ifname, iface.address);
            }
            ++alias;
          });
        });  
   
   
    res.send(localip);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
