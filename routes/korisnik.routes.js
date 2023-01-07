var express = require('express');
var router = express.Router();
var db = require('../db/index');
const bp = require('body-parser');

router.get('/', async function(req, res){
    console.log(JSON.stringify(req.oidc.user));
    if(req.oidc.isAuthenticated()){
        (await db.query("COPY(SELECT proizvod.*, asortiman.trgovackiLanac, asortiman.kolicina, asortiman.cijena FROM proizvod natural join asortiman) TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortiman_trgovina.csv' WITH DELIMITER ','"));
        (await db.query("COPY (SELECT array_to_json(array_agg(row_to_json(artikli))) FROM (SELECT sifraProizvod, nazivProizvod, vrstaProizvod , mjernaJed , mjeraProizvod , proizvodac , zemljaPodrijetla , dobnoOgranicenje , skladistenje , godinaProizvodnje , (select array_to_json(array_agg(row_to_json(trgovinaInfo))) from (select trgovackiLanac , kolicina , cijena from asortiman where proizvod.sifraProizvod = asortiman.sifraProizvod) as trgovinaInfo ) from proizvod) as artikli)TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortiman_trgovina.json';"));
    }
    res.render('korisnik', {
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    });
});

module.exports=router;