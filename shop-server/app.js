var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

//连接mongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/vue_shop');
mongoose.connection.on('connected', () => {
    console.log('连接成功...')
});
mongoose.connection.on('error', () => {
    console.log('连接失败...')
});
mongoose.connection.on('disconnected', () => {
    console.log('断开连接...')
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//解决跨域
app.all('*', function (req, res, next) {
    // CORS配置
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


//登录拦截
app.use((req, res, next) => {
    if (req.cookies.userId) {
        next();
    } else {
        if (req.originalUrl == '/users/login' ||
            req.originalUrl == '/users/logout' ||
            req.originalUrl.indexOf('/goods') > -1 ||
            req.originalUrl == '/users/checkLogin') {
            next();
        } else {
            res.json({
                status: '10001',
                msg: '当前未登录',
                result: {}
            })
        }
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
