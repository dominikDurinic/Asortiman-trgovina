--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asortiman; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asortiman (
    sifraproizvod character varying(13),
    trgovackilanac character varying(30),
    kolicina integer,
    cijena real
);


ALTER TABLE public.asortiman OWNER TO postgres;

--
-- Name: proizvod; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proizvod (
    sifraproizvod character varying(13),
    nazivproizvod character varying(30),
    vrstaproizvod character varying(30),
    mjernajed character varying(10),
    mjeraproizvod real,
    proizvodac character varying(30),
    zemljapodrijetla character varying(30),
    dobnoogranicenje character(2),
    skladistenje character varying(10),
    godinaproizvodnje integer
);


ALTER TABLE public.proizvod OWNER TO postgres;

--
-- Data for Name: asortiman; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asortiman (sifraproizvod, trgovackilanac, kolicina, cijena) FROM stdin;
123456789	Konzum	100	13.99
123456789	Spar	94	16.5
123456789	LIDL	80	12.99
987456321	Konzum	47	21.99
987456321	Spar	75	23
135798462	Kaufland	73	7.38
135798462	LIDL	50	7.38
135798462	Konzum	100	7.38
789123456	Kaufland	70	149.99
789123456	Spar	60	150
789123456	Konzum	40	149.97
456123789	Kaufland	70	56.99
456123789	Spar	60	58
456123789	Konzum	50	56.99
147852369	Kaufland	30	5.99
147852369	LIDL	50	5.99
147852369	Spar	48	6.99
147852369	Konzum	68	5.99
963258741	Kaufland	30	15.99
963258741	LIDL	20	15.99
963258741	Konzum	40	14.99
124578963	Kaufland	50	49.99
124578963	Spar	40	48.99
485455888	Konzum	100	5.77
485455888	Spar	100	6
378624525	Kaufland	30	14.99
378624525	Spar	50	14.99
378624525	Konzum	30	14.99
231458456	Kaufland	50	16.99
231458456	Spar	62	15.99
231458456	Konzum	42	14.99
231458456	LIDL	75	14.99
789946161	Kaufland	50	6
789946161	Spar	40	6
789946161	Konzum	30	5.49
789946161	LIDL	20	5.49
\.


--
-- Data for Name: proizvod; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proizvod (sifraproizvod, nazivproizvod, vrstaproizvod, mjernajed, mjeraproizvod, proizvodac, zemljapodrijetla, dobnoogranicenje, skladistenje, godinaproizvodnje) FROM stdin;
123456789	Cedevita naranča	piće	gram	200	Atlantic	Hrvatska	ne	stalaža	2022
789123456	Pampers Premium Care	pelene	komad	80	Procter and Gamble	Poljska	ne	stalaža	2022
147852369	Dorina čokolada mliječna	slatkiš	gram	80	KRAŠ	Hrvatska	ne	stalaža	2022
963258741	Zvijezda suncokretovo ulje	ulje	litra	1	ZVIJEZDA	Hrvatska	ne	stalaža	2022
124578963	Zewa Deluxe Toaletni papir	potrepštine	komad	10	SCA Hygiene Products	Austrija	ne	stalaža	2022
485455888	Pšenično bijelo brašno glatko	brašno	gram	1000	Granolio	Hrvatska	ne	stalaža	2022
378624525	Juicy Sok 100% naranča	piće	litra	1	Stanić Beverages	Hrvatska	ne	stalaža	2022
231458456	Vegeta Original	začin	gram	250	PODRAVKA	Hrvatska	ne	stalaža	2022
789946161	Orbit Žvakaća guma spearmint	slatkiš	gram	14	Mars Hrvatska	Hrvatska	ne	stalaža	2022
135798462	zbregov trajno mlijeko	mliječni proizvod	litra	1	Vindija	Hrvatska	ne	hladnjak	2022
456123789	Cekin pileći file	meso	gram	600	KOKA	Hrvatska	ne	hladnjak	2022
987456321	LEDO Pommes frites	smrznuta hrana	gram	1000	LEDO plus	Hrvatska	ne	zamrzivač	2021
\.


--
-- PostgreSQL database dump complete
--

