const express = require('express');
const app = express();
const port = 3000;
const bp = require('body-parser')
const datatableRouter = require('./routes/datatable.routes');

app.use(express.static('public'));
app.use('/css',express.static(__dirname + 'public/css'));
app.use('/images',express.static(__dirname + 'public/images'));
app.use('/js',express.static(__dirname + 'public/js'));
app.use('/datatable', datatableRouter);


app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');

//get
app.get('',(req,res)=>{
    res.render('index');
});

app.get('/datatable',(req,res)=>{
    res.render('datatable');
});

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