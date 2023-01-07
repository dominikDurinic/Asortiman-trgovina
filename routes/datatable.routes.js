//podaci-iz-baze
var express = require('express');
var router = express.Router();
var db = require('../db/index');
const bp = require('body-parser')


router.get('/', async function(req, res, next){
    
    let podaci = (await db.query('SELECT * FROM asortiman NATURAL JOIN proizvod')).rows;
    if(req.oidc.isAuthenticated()){
        (await db.query("COPY(SELECT proizvod.*, asortiman.trgovackiLanac, asortiman.kolicina, asortiman.cijena FROM proizvod natural join asortiman) TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortiman_trgovina.csv' WITH DELIMITER ','"));
        (await db.query("COPY (SELECT array_to_json(array_agg(row_to_json(artikli))) FROM (SELECT sifraProizvod, nazivProizvod, vrstaProizvod , mjernaJed , mjeraProizvod , proizvodac , zemljaPodrijetla , dobnoOgranicenje , skladistenje , godinaProizvodnje , (select array_to_json(array_agg(row_to_json(trgovinaInfo))) from (select trgovackiLanac , kolicina , cijena from asortiman where proizvod.sifraProizvod = asortiman.sifraProizvod) as trgovinaInfo ) from proizvod) as artikli)TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortiman_trgovina.json';"));
    }
    res.render('datatable', {
        podaci: podaci,
        isAuthenticated: req.oidc.isAuthenticated(),
        ime: req.oidc.user
    });

});

router.use(bp.json())
router.use(bp.urlencoded({ extended: true }))

router.post('/', async function(req, res, next){
    //res.send(req.body.search);
    let pretrazi = req.body.search;
    let intbrojka = parseInt(pretrazi);
    let floatbrojka = parseFloat(pretrazi);
    if(isNaN(intbrojka) && isNaN(floatbrojka)){
        intbrojka=0;
        floatbrojka=0;
    }
    let polje = req.body.poljepretrage;
    let podaci;
    let csvispis;
    let jsonispis;

    if(pretrazi == ''){
        podaci=(await db.query('SELECT * FROM asortiman NATURAL JOIN proizvod')).rows;
        (await db.query("COPY(SELECT proizvod.*, asortiman.trgovackiLanac, asortiman.kolicina, asortiman.cijena FROM proizvod natural join asortiman) TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortimanTrgovina.csv' WITH DELIMITER ','"));
        (await db.query("COPY (SELECT array_to_json(array_agg(row_to_json(artikli))) FROM (SELECT sifraProizvod, nazivProizvod, vrstaProizvod , mjernaJed , mjeraProizvod , proizvodac , zemljaPodrijetla , dobnoOgranicenje , skladistenje , godinaProizvodnje , (select array_to_json(array_agg(row_to_json(trgovinaInfo))) from (select trgovackiLanac , kolicina , cijena from asortiman where proizvod.sifraProizvod = asortiman.sifraProizvod) as trgovinaInfo ) from proizvod) as artikli)TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortimanTrgovina.json';"));
    }else if(pretrazi!='' && polje=='nazivproizvod'){
        podaci=(await db.query("SELECT * FROM asortiman NATURAL JOIN proizvod WHERE nazivproizvod LIKE '%" + pretrazi + "%'")).rows;
        (await db.query("COPY(SELECT proizvod.*, asortiman.trgovackiLanac, asortiman.kolicina, asortiman.cijena FROM proizvod natural join asortiman WHERE nazivproizvod LIKE '%" + pretrazi + "%'" + " ) TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortimanTrgovina.csv' WITH DELIMITER ','"));
        (await db.query("COPY (SELECT array_to_json(array_agg(row_to_json(artikli))) FROM (SELECT sifraProizvod, nazivProizvod, vrstaProizvod , mjernaJed , mjeraProizvod , proizvodac , zemljaPodrijetla , dobnoOgranicenje , skladistenje , godinaProizvodnje , (select array_to_json(array_agg(row_to_json(trgovinaInfo))) from (select trgovackiLanac , kolicina , cijena from asortiman where proizvod.sifraProizvod = asortiman.sifraProizvod) as trgovinaInfo ) from proizvod WHERE nazivproizvod LIKE '%" + pretrazi + "%'" + ") as artikli)TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortimanTrgovina.json';"));
    }else if(pretrazi!='' && polje=='trgovac'){
        podaci=(await db.query("SELECT * FROM asortiman NATURAL JOIN proizvod WHERE trgovackilanac LIKE '%" + pretrazi + "%'")).rows;
        (await db.query("COPY(SELECT proizvod.*, asortiman.trgovackiLanac, asortiman.kolicina, asortiman.cijena FROM proizvod natural join asortiman WHERE trgovackilanac LIKE '%" + pretrazi + "%'" + " ) TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortimanTrgovina.csv' WITH DELIMITER ','"));
        (await db.query("COPY (SELECT array_to_json(array_agg(row_to_json(artikli))) FROM (SELECT sifraProizvod, nazivProizvod, vrstaProizvod , mjernaJed , mjeraProizvod , proizvodac , zemljaPodrijetla , dobnoOgranicenje , skladistenje , godinaProizvodnje , (select array_to_json(array_agg(row_to_json(trgovinaInfo))) from (select trgovackiLanac , kolicina , cijena from asortiman where proizvod.sifraProizvod = asortiman.sifraProizvod and trgovackilanac LIKE '%" + pretrazi + "%'" + ") as trgovinaInfo ) from proizvod where (select array_to_json(array_agg(row_to_json(trgovinaInfo))) from (select trgovackiLanac , kolicina , cijena from asortiman where proizvod.sifraProizvod = asortiman.sifraProizvod and trgovackilanac LIKE '%" + pretrazi + "%'" + ") as trgovinaInfo )  is not null) as artikli)TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortimanTrgovina.json';"));
    }else if(pretrazi!='' && polje=='wildcard'){
        podaci=(await db.query("SELECT * FROM asortiman NATURAL JOIN proizvod WHERE sifraproizvod LIKE '%" + pretrazi + "%' OR nazivproizvod LIKE '%" + pretrazi + "%'" + " OR vrstaproizvod LIKE '%" + pretrazi + "%' OR mjernajed LIKE '%" + pretrazi + "%'" + " OR zemljapodrijetla LIKE '%" + pretrazi + "%'" + " OR proizvodac LIKE '%" + pretrazi + "%'" + " OR mjeraproizvod ="+ floatbrojka + " OR dobnoogranicenje LIKE '%" + pretrazi + "%' OR skladistenje LIKE '%" + pretrazi + "%' OR godinaproizvodnje ="+ intbrojka + " OR trgovackilanac LIKE '%" + pretrazi + "%'" + " OR kolicina =" + intbrojka+" OR cijena LIKE '" + pretrazi +"%'")).rows;
        (await db.query("COPY(SELECT proizvod.*, asortiman.trgovackiLanac, asortiman.kolicina, asortiman.cijena FROM proizvod natural join asortiman WHERE sifraproizvod LIKE '%" + pretrazi + "%' OR nazivproizvod LIKE '%" + pretrazi + "%'" + " OR vrstaproizvod LIKE '%" + pretrazi + "%' OR mjernajed LIKE '%" + pretrazi + "%'" + " OR zemljapodrijetla LIKE '%" + pretrazi + "%'" + " OR proizvodac LIKE '%" + pretrazi + "%'" + " OR mjeraproizvod ="+ floatbrojka + " OR dobnoogranicenje LIKE '%" + pretrazi + "%' OR skladistenje LIKE '%" + pretrazi + "%' OR godinaproizvodnje ="+ intbrojka + " OR trgovackilanac LIKE '%" + pretrazi + "%'" + " OR kolicina =" + intbrojka+" OR cijena LIKE '" + pretrazi +"%'"+" ) TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortimanTrgovina.csv' WITH DELIMITER ','"));
        (await db.query("COPY (SELECT array_to_json(array_agg(row_to_json(artikli))) FROM (SELECT sifraProizvod, nazivProizvod, vrstaProizvod , mjernaJed , mjeraProizvod , proizvodac , zemljaPodrijetla , dobnoOgranicenje , skladistenje , godinaProizvodnje , (select array_to_json(array_agg(row_to_json(trgovinaInfo))) from (select trgovackiLanac , kolicina , cijena from asortiman where proizvod.sifraProizvod = asortiman.sifraProizvod or (trgovackilanac LIKE '%" + pretrazi + "%'" + " OR kolicina =" + intbrojka +" OR cijena LIKE '%" + pretrazi +"%'"+")) as trgovinaInfo ) from proizvod WHERE sifraproizvod LIKE '%" + pretrazi + "%'" + " OR nazivproizvod LIKE '%" + pretrazi + "%'" + " OR vrstaproizvod LIKE '%" + pretrazi + "%' OR mjernajed LIKE '%" + pretrazi + "%'" + " OR zemljapodrijetla LIKE '%" + pretrazi + "%'" + " OR proizvodac LIKE '%" + pretrazi + "%'" + " OR mjeraproizvod ="+ floatbrojka + " OR dobnoogranicenje LIKE '%" + pretrazi + "%' OR skladistenje LIKE '%" + pretrazi + "%' OR godinaproizvodnje ="+ intbrojka +" OR '%" + pretrazi+ "%' in (select trgovackiLanac from asortiman where proizvod.sifraProizvod = asortiman.sifraProizvod and (trgovackilanac LIKE '%" + pretrazi + "%'" + " OR cijena LIKE '%" + pretrazi +"%'"+")) or '%" + intbrojka + "%'" + " in (select trgovackiLanac from asortiman where proizvod.sifraProizvod = asortiman.sifraProizvod and (trgovackilanac LIKE '%" + pretrazi + "%'" + " OR cijena LIKE '%" + pretrazi +"%'"+"))) as artikli)TO 'C:/FER/OTVRAC/Asortiman-trgovina/asortimanTrgovina.json';"));
    }
    res.render('datatable', {
        podaci: podaci,
        isAuthenticated: req.oidc.isAuthenticated(),
        ime: req.oidc.user
    });
})

module.exports = router;