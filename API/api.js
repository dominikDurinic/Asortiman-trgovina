const express = require('express');
const bp = require('body-parser');
const app = express();
const port = 8080;
const db = require('./query');

const {successResp, errorResp} = require("./Response");
const { response, request } = require('express');

app.use(bp.json())

app.use(
  bp.urlencoded({
  extended: true,
  })
)

app.get('/api/v1/openapi', db.getOpenApi);
app.get('/api/v1/products', db.getProduct);
app.get('/api/v1/products/:sifraProizvod', db.getProductBySifra);
app.get('/api/v1/products/mjernajedinica/:mjernajed', db.getProductByMjernaJed);
app.get('/api/v1/products/trgovac/:trgovac', db.getProductByTrgovac);
app.get('/api/v1/products/vrsta/:vrsta', db.getProductByVrsta);
app.post('/api/v1/products', db.createProduct);
app.put('/api/v1/products/:sifraProizvod', db.putProduct);
app.delete('/api/v1/products/:sifraProizvod', db.deleteProduct);

app.listen(port);
