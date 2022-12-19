//npm에서 받은 자료를 먼저 선언  
const expressLayout = require('express-ejs-layouts');
const express = require('express');
const cookieParser = require('cookie-parser')
const routers = require('./routers/router');
const path = require('path');
const app = express();

// app.set('views',push.join(__dirname, 'views'));
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayout);
app.use(cookieParser());
app.use("/", routers);
app.use(express.static(path.join(__dirname, 'public')));


//앱의 형태로 모듈화 시켜서 내보내겠다는 언어
module.exports = app;