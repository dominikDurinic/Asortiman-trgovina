CREATE TABLE asortiman
	(sifraProizvod VARCHAR(13),
	 trgovackiLanac VARCHAR(30),
	 kolicina INTEGER,
	 cijena REAL);
	 
CREATE TABLE proizvod
	(sifraProizvod VARCHAR(13),
	 nazivProizvod VARCHAR(30),
	 vrstaProizvod VARCHAR(30),
	 mjernaJed VARCHAR(10),
	 mjeraProizvod REAL,
	 proizvodac VARCHAR(30),
	 zemljaPodrijetla VARCHAR(30)
	);

INSERT INTO asortiman VALUES
('123456789','Konzum',100,13.99);
INSERT INTO asortiman VALUES
('123456789','Spar',94,16.50);
INSERT INTO asortiman VALUES
('123456789','LIDL',80,12.99);
INSERT INTO proizvod VALUES
('123456789','Cedevita naranča','piće','gram',200,'Atlantic','Hrvatska');

INSERT INTO asortiman VALUES
('987456321','Konzum',47,21.99);
INSERT INTO asortiman VALUES
('987456321','Spar',75,23.00);
INSERT INTO proizvod VALUES
('987456321','LEDO Pommes frites','smrznuta hrana','gram',1000,'LEDO plus','Hrvatska');


INSERT INTO asortiman VALUES
('135798462','Kaufland',73,7.38);
INSERT INTO asortiman VALUES
('135798462','LIDL',50,7.38);
INSERT INTO asortiman VALUES
('135798462','Konzum',100,7.38);
INSERT INTO proizvod VALUES
('135798462','zbregov trajno mlijeko','mliječni proizvod','litra',1,'Vindija','Hrvatska');

INSERT INTO asortiman VALUES
('789123456','Kaufland',70,149.99);
INSERT INTO asortiman VALUES
('789123456','Spar',60,150.00);
INSERT INTO asortiman VALUES
('789123456','Konzum',40,149.97);
INSERT INTO proizvod VALUES
('789123456','Pampers Premium Care','pelene','komad',80,'Procter and Gamble','Poljska');

INSERT INTO asortiman VALUES
('456123789','Kaufland',70,56.99);
INSERT INTO asortiman VALUES
('456123789','Spar',60,58.00);
INSERT INTO asortiman VALUES
('456123789','Konzum',50,56.99);
INSERT INTO proizvod VALUES
('456123789','Cekin pileći file','meso','gram',600,'KOKA','Hrvatska');

INSERT INTO asortiman VALUES
('147852369','Kaufland',30,5.99);
INSERT INTO asortiman VALUES
('147852369','LIDL',50,5.99);
INSERT INTO asortiman VALUES
('147852369','Spar',48,6.99);
INSERT INTO asortiman VALUES
('147852369','Konzum',68,5.99);
INSERT INTO proizvod VALUES
('147852369','Dorina čokolada mliječna','slatkiš','gram',80,'KRAŠ','Hrvatska');

INSERT INTO asortiman VALUES
('963258741','Kaufland',30,15.99);
INSERT INTO asortiman VALUES
('963258741','LIDL',20,15.99);
INSERT INTO asortiman VALUES
('963258741','Konzum',40,14.99);
INSERT INTO proizvod VALUES
('963258741','Zvijezda suncokretovo ulje','ulje','litra',1,'ZVIJEZDA','Hrvatska');

INSERT INTO asortiman VALUES
('124578963','Kaufland',50,49.99);
INSERT INTO asortiman VALUES
('124578963','Spar',40,48.99);
INSERT INTO proizvod VALUES
('124578963','Zewa Deluxe Toaletni papir','potrepštine','komad',10,'SCA Hygiene Products','Austrija');

INSERT INTO asortiman VALUES
('485455888','Konzum',100,5.77);
INSERT INTO asortiman VALUES
('485455888','Spar',100,6.00);
INSERT INTO proizvod VALUES
('485455888','Pšenično bijelo brašno glatko','brašno','gram',1000,'Granolio','Hrvatska');

INSERT INTO asortiman VALUES
('378624525','Kaufland',30,14.99);
INSERT INTO asortiman VALUES
('378624525','Spar',50,14.99);
INSERT INTO asortiman VALUES
('378624525','Konzum',30,14.99);
INSERT INTO proizvod VALUES
('378624525','Juicy Sok 100% naranča','piće','litra',1,'Stanić Beverages','Hrvatska');


INSERT INTO asortiman VALUES
('231458456','Kaufland',50,16.99);
INSERT INTO asortiman VALUES
('231458456','Spar',62,15.99);
INSERT INTO asortiman VALUES
('231458456','Konzum',42,14.99);
INSERT INTO asortiman VALUES
('231458456','LIDL',75,14.99);
INSERT INTO proizvod VALUES
('231458456','Vegeta Original','začin','gram',250,'PODRAVKA','Hrvatska');

INSERT INTO asortiman VALUES
('789946161','Kaufland',50,6.00);
INSERT INTO asortiman VALUES
('789946161','Spar',40,6.00);
INSERT INTO asortiman VALUES
('789946161','Konzum',30,5.49);
INSERT INTO asortiman VALUES
('789946161','LIDL',20,5.49);
INSERT INTO proizvod VALUES
('789946161','Orbit Žvakaća guma spearmint','slatkiš','gram',14,'Mars Hrvatska','Hrvatska');

/*Izdvajanje podataka u CSV format*/
COPY(
	SELECT proizvod.*, 
			asortiman.trgovackiLanac,
			asortiman.kolicina,
			asortiman.cijena
	FROM proizvod natural join asortiman
) TO 'C://FER/OTVRAC/1.Labos/asortiman_trgovina.csv' WITH DELIMITER ',';

/*Izdvajanje podataka u JSON format*/
COPY (
    SELECT array_to_json(array_agg(row_to_json(artikli)))
	FROM (
		SELECT sifraProizvod as "Šifra proizvoda",
				nazivProizvod as "Naziv proizvoda",
				vrstaProizvod as "Vrsta proizvoda",
				mjernaJed as "Mjerna jedinica",
				mjeraProizvod as "Mjera proizvoda",
				proizvodac as "Proizvođač",
				zemljaPodrijetla as "Zemlja podrijetla",
			(
			  select array_to_json(array_agg(row_to_json(trgovinaInfo)))
			  from (
				select trgovackiLanac as "Naziv trgovine",
						kolicina as "Količina",
						cijena as "Cijena (kuna)"
				from asortiman
				where proizvod.sifraProizvod = asortiman.sifraProizvod
			  ) as trgovinaInfo
			) as "Prodavaonica"
	  from proizvod
	) as artikli
)TO 'C://FER/OTVRAC/1.Labos/asortiman_trgovina.json'; 
