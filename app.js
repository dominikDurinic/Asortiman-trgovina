const express = require('express');
const app = express();
const port = 3000;
const bp = require('body-parser')
const datatableRouter = require('./routes/datatable.routes');
const indexRouter = require('./routes/index.routes');
const korisnikRouter = require('./routes/korisnik.routes');
const { auth } = require('express-openid-connect');


//auth0
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'usnWvLJ3x8pY7NHuSSVFeMga0ZwN1OZt',
    issuerBaseURL: 'https://dev-n4txjn5xci08w7xh.us.auth0.com'
  };

app.use(express.static('public'));
app.use('/css',express.static(__dirname + 'public/css'));
app.use('/images',express.static(__dirname + 'public/images'));
app.use('/js',express.static(__dirname + 'public/js'));

app.use(auth(config));
app.use('/',indexRouter);
app.use('/datatable', datatableRouter);
app.use('/korisnik', korisnikRouter);


app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');

//get
/* app.get('',(req,res)=>{
     res.render('index');
 });

 app.get('/datatable',(req,res)=>{
    res.render('datatable');
 });*/


//button-link-download
app.get('/download-csv',(req,res)=>{
    res.download("asortiman_trgovina.csv");
});
app.get('/download-csv-filter',(req,res)=>{
    res.download("asortimanTrgovina.csv");
});
app.get('/download-json',(req,res)=>{
    res.download("asortiman_trgovina.json");
});
app.get('/download-json-filter',(req,res)=>{
    res.download("asortimanTrgovina.json");
});

app.listen(port);