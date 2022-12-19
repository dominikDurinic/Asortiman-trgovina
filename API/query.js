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
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen zahtjevani resurs", results.rows))
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
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen zahtjevani resurs sa sifraProizvod = " + sifraProizvod, results.rows))
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
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen zahtjevani resurs sa mjernaJed = " + mjernajed, results.rows))
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
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen zahtjevani resurs sa trgovackiLanac = " + trgovac, results.rows))
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
        response.status(200).json(successResp(200, "OK", "Uspješno dohvaćen zahtjevani resurs sa vrstaProizvod = " + vrsta, results.rows))
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