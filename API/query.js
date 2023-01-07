const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'asortimanTrgovina',          //baza
  password: 'bazepodataka',
  port: 5432,
})

const {successResp, errorResp} = require("./Response");
const fs = require('fs');
const { count } = require('console');
const { json } = require('body-parser');

//JSON Object - JSON-LD

function JSONMaker(results, length, lista) {
  for(let i=0;i<length;i++){
    let obj = {"@context":{"@vocab":"http://schema.org/","sifraProizvod":"productID","nazivProizvod":"name","proizvodac":"manufacturer","zemljaPodrijetla":"countryOfOrigin"},
    "sifraProizvod":JSON.stringify(results.rows[i].sifraproizvod).replace("\"", "").replace("\"", ""), 
    "nazivProizvod":JSON.stringify(results.rows[i].nazivproizvod).replace("\"", "").replace("\"", ""),
    "vrstaProizvod":JSON.stringify(results.rows[i].vrstaproizvod).replace("\"", "").replace("\"", ""),
    "mjernaJed":JSON.stringify(results.rows[i].mjernajed).replace("\"", "").replace("\"", ""),
    "mjeraProizvod":JSON.stringify(results.rows[i].mjeraproizvod).replace("\"", "").replace("\"", ""),
    "proizvodac":JSON.stringify(results.rows[i].proizvodac).replace("\"", "").replace("\"", ""),
    "zemljaPodrijetla":JSON.stringify(results.rows[i].zemljapodrijetla).replace("\"", "").replace("\"", ""),
    "dobnoOgranicenje":JSON.stringify(results.rows[i].dobnoogranicenje).replace("\"", "").replace("\"", ""),
    "skladistenje":JSON.stringify(results.rows[i].skladistenje).replace("\"", "").replace("\"", ""),
    "godinaProizvodnje":JSON.stringify(results.rows[i].godinaproizvodnje).replace("\"", "").replace("\"", ""),
    "trgovackiLanac":JSON.stringify(results.rows[i].trgovackilanac).replace("\"", "").replace("\"", ""),
    "kolicina":JSON.stringify(results.rows[i].kolicina).replace("\"", "").replace("\"", ""),
    "cijena":JSON.stringify(results.rows[i].cijena).replace("\"", "").replace("\"", "")
    };
    lista.push(obj);
  }
}

//GET OpenApi
const getOpenApi = (request,response)=>{
  fs.readFile('../openapi.json', 'utf8', (err, data) => {
    if (err) {
      response.status(500).json(errorResp(500,"Internal Server Error","Neuspješno dohvaćanje OpenAPI specifikacije"))
    }else{
      response.status(200).setHeader('Content-Type', 'application/json').send(data)
    }
  });
}

//GET cijeloukupne kolekcije
const getProduct = (request, response) => {
    pool.query('SELECT * FROM proizvod NATURAL JOIN asortiman', (error, results) => {
      if(error){
        response.status(404).json(errorResp(404,"Not Found", "Neuspješno dohvaćanje resursa"))
      }else{
        let lista = [];
        JSONMaker(results,results.rows.length, lista);
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen resurs", lista))
      }
   })
  }

//GET pojedinacnog resursa sa sifraproizvod

const getProductBySifra = (request, response) => {
  const sifraProizvod = request.params.sifraProizvod;
  if(sifraProizvod.match(/[A-Za-z]/)){
    response.status(400).json(errorResp(400,"Bad Request", "Pogrešan unos sifraProizvod"))
  }else{
    pool.query('SELECT * FROM proizvod NATURAL JOIN asortiman WHERE sifraProizvod = $1', [sifraProizvod], (error, results) => {
      if (results.rowCount==0) {
        response.status(404).json(errorResp(404,"Not Found", "Zahtjevani resurs sa sifraProizvod = " + sifraProizvod + " ne postoji"))
      }else{
        let lista = [];
        JSONMaker(results,results.rows.length, lista);
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen zahtjevani resurs sa sifraProizvod = " + sifraProizvod, lista))
      }
    })
  }

}

//GET pojedinacnog resursa sa mjernaJed

const getProductByMjernaJed = (request, response) => {
  const mjernajed = request.params.mjernajed;
  if(mjernajed.match(/[0-9]/)){
    response.status(400).json(errorResp(400,"Bad Request", "Pogrešan unos mjerna jedinica"))
  }else{
    pool.query('SELECT * FROM proizvod NATURAL JOIN asortiman WHERE mjernaJed = $1', [mjernajed], (error, results) => {
      if (results.rowCount==0) {
        response.status(404).json(errorResp(404,"Not Found", "Zahtjevana mjerna jedinica  " + mjernajed + " ne postoji"))
      }else{
        let lista = [];
        JSONMaker(results,results.rows.length, lista);
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen zahtjevani resurs sa mjernaJed = " + mjernajed, lista))
      }
    })
  }
}

//GET pojedinacnog resursa sa trgovackiLanac

const getProductByTrgovac= (request, response) => {
  const trgovac = request.params.trgovac;
  if(trgovac.match(/[0-9]/)){
    response.status(400).json(errorResp(400,"Bad Request", "Pogrešan unos trgovačkog lanca"))
  }else{
    pool.query('SELECT * FROM proizvod NATURAL JOIN asortiman WHERE trgovackiLanac = $1', [trgovac], (error, results) => {
      if (results.rowCount==0) {
        response.status(404).json(errorResp(404,"Not Found", "Zahtjevani trgovački lanac " + trgovac + " ne postoji"))
      }else{
        let lista = [];
        JSONMaker(results,results.rows.length, lista);
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen zahtjevani resurs sa trgovackiLanac = " + trgovac, lista))
      }
    })
  }
}

//GET pojedinacnog resursa sa vrstaProizvod

const getProductByVrsta = (request, response) => {
  const vrsta = request.params.vrsta;
  if(vrsta.match(/[0-9]/)){
    response.status(400).json(errorResp(400,"Bad Request", "Pogrešan unos vrste proizvoda"))
  }else{
    pool.query('SELECT * FROM proizvod NATURAL JOIN asortiman WHERE vrstaProizvod = $1', [vrsta], (error, results) => {
      if (results.rowCount==0) {
        response.status(404).json(errorResp(404,"Not Found", "Zahtjevana vrsta proizvoda " + vrsta + " ne postoji"))
      }else{
        let lista = [];
        JSONMaker(results,results.rows.length, lista);
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen zahtjevani resurs sa vrstaProizvod = " + vrsta, lista))
      }
    })
  }
}

//POST unos pojedinacnog resursa
const createProduct = (request, response) => {
  const { sifraProizvod, nazivProizvod, vrstaProizvod, mjernaJed, mjeraProizvod, proizvodac, zemljaPodrijetla, dobnoOgranicenje, skladistenje, godinaProizvodnje, trgovackiLanac, kolicina, cijena } = request.body
  const id = sifraProizvod;
  if(!request.body.sifraProizvod||!request.body.nazivProizvod||!request.body.vrstaProizvod||!request.body.mjernaJed||!request.body.mjeraProizvod||!request.body.proizvodac||!request.body.zemljaPodrijetla||!request.body.dobnoOgranicenje||!request.body.skladistenje||!request.body.godinaProizvodnje||!request.body.trgovackiLanac||!request.body.kolicina||!request.body.cijena){
    response.status(400).json(errorResp(400,"Bad Request", "Pogrešan unos resursa"))
  }else{
    pool.query('INSERT INTO proizvod (sifraProizvod, nazivProizvod, vrstaProizvod, mjernaJed, mjeraProizvod, proizvodac, zemljaPodrijetla, dobnoOgranicenje, skladistenje, godinaProizvodnje) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [sifraProizvod, nazivProizvod, vrstaProizvod, mjernaJed, mjeraProizvod, proizvodac, zemljaPodrijetla, dobnoOgranicenje, skladistenje, godinaProizvodnje], (error, results) => {
      if (error) {
        response.status(400).json(errorResp(400,"Bad Request", "Neuspješan unos resursa zbog već postojeće vrijednosti ključa šifraProizvod = "+ request.body.sifraProizvod))
      }else{
        pool.query('INSERT INTO asortiman (sifraProizvod, trgovackiLanac, kolicina, cijena) VALUES ($1, $2, $3, $4)', [sifraProizvod,trgovackiLanac, kolicina, cijena], (error, results) => {
        })
        response.status(201).json(successResp(201, "Created", "Uspješno unesen zahtjevani resurs", request.body))
      }
    })
    
  } 
}

//PUT update pojedinacnog resursa sa sifraProizvod
const putProduct = (request, response) => {
  const id = request.params.sifraProizvod;
  const { sifraProizvod, nazivProizvod, vrstaProizvod, mjernaJed, mjeraProizvod, proizvodac, zemljaPodrijetla, dobnoOgranicenje, skladistenje, godinaProizvodnje, trgovackiLanac, kolicina, cijena } = request.body;
  if(!request.body.sifraProizvod||!request.body.nazivProizvod||!request.body.vrstaProizvod||!request.body.mjernaJed||!request.body.mjeraProizvod||!request.body.proizvodac||!request.body.zemljaPodrijetla||!request.body.dobnoOgranicenje||!request.body.skladistenje||!request.body.godinaProizvodnje||!request.body.trgovackiLanac||!request.body.kolicina||!request.body.cijena){
    response.status(400).json(errorResp(400,"Bad Request", "Pogrešan unos resursa"))
  }else{
    if(id.match(/[A-Za-z]/)){
      response.status(400).json(errorResp(400,"Bad Request", "Pogrešan unos sifraProizvod"))
    }else{
    pool.query(
      'UPDATE proizvod SET sifraProizvod=$1, nazivProizvod=$2, vrstaProizvod=$3, mjernaJed=$4, mjeraProizvod=$5, proizvodac=$6, zemljaPodrijetla=$7, dobnoOgranicenje=$8, skladistenje=$9, godinaProizvodnje=$10 WHERE sifraProizvod = $11', [sifraProizvod, nazivProizvod, vrstaProizvod, mjernaJed, mjeraProizvod, proizvodac, zemljaPodrijetla, dobnoOgranicenje, skladistenje, godinaProizvodnje, id], (error, results) => {
        if (results.rowCount==0) {
          response.status(404).json(errorResp(404,"Not Found", "Zahtjevani resurs sa sifraProizvod = " + id + " ne postoji"))
        }else{
          pool.query(
            'UPDATE asortiman SET sifraProizvod=$1, trgovackiLanac=$2, kolicina=$3, cijena=$4 WHERE sifraProizvod = $5', [sifraProizvod, trgovackiLanac, kolicina, cijena, id], (error, results) => {
          })
          response.status(200).json(successResp(200, "OK", "Uspješno unesena promjena zahtjevanog resursa sa sifraProizvod = " + id))
        }
      }
    )
    }
  }
}

//DELETE pojedinacni resurs sa sifraProizvod
const deleteProduct = (request, response) => {
  const id = request.params.sifraProizvod
  const krivo = false;
  if(id.match(/[A-Za-z]/)){
    response.status(400).json(errorResp(400,"Bad Request", "Pogrešan unos sifraProizvod"))
  }else{
  pool.query('DELETE FROM proizvod WHERE sifraProizvod = $1', [id], (error, results) => {
    if (results.rowCount==0) {
      response.status(404).json(errorResp(404,"Not Found", "Zahtjevani resurs sa sifraProizvod = " + id + " ne postoji"))
    }else{
      pool.query('DELETE FROM asortiman WHERE sifraProizvod = $1', [id], (error, results) => {
      })
      response.status(200).json(successResp(200, "OK", "Uspješno obrisan zahtjevani resurs sa sifraProizvod = " + id))
    }
  })
}
}

  module.exports = {
    getOpenApi,
    getProduct,
    getProductBySifra,
    getProductByMjernaJed,
    getProductByTrgovac,
    getProductByVrsta,
    createProduct,
    putProduct,
    deleteProduct
  }