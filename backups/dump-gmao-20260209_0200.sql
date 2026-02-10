pg_dump: warning: there are circular foreign-key constraints on this table:
pg_dump: detail: Material
pg_dump: hint: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: hint: Consider using a full dump instead of a --data-only dump to avoid this problem.
--
-- PostgreSQL database dump
--

\restrict k5J6yRP2U5kagov2Spzz6s7cMCBdqFol7tMSsbxI8FdqxVQYy2A38B79QMPRyWq

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

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

--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Service" (id, label) FROM stdin;
1	atelier
2	services-generaux
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Category" (id, label, "serviceId") FROM stdin;
55	CVC ECHANGEUR	2
56	CVC POMPE	2
58	MANUTENTION GERBEUR	2
59	MANUTENTION CHARIOT FRONTAL GAZ	2
60	MANUTENTION CHARIOT FRONTAL ELECTRIQUE	2
61	MANUTENTION PALANS	2
62	REFREGIRATION	2
63	ELECTRICITE HT	2
64	EAU TRAITEMENT DE L'EAU	2
65	EAU STATION TRAITEMENT DE L'EAU	2
66	EAU RECUPERATION EAU DE PLUIE	2
22	Pièce détachées	1
23	Courroie	1
24	Roulement	1
25	Bagues	1
26	Filtre pesticide	1
1	Tracteur	1
21	Filtre cabine	1
18	Filtre GO	1
20	Filtre Hydraulique	1
15	Filtre à air principal	1
16	Filtre à air secondaire	1
17	Filtre à huile	1
19	Préfiltre GO	1
54	CVC CTA	2
\.


--
-- Data for Name: Localisation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Localisation" (id, label) FROM stdin;
1	Forts
2	Bâti Viti
3	Bâtiment principal
4	Chai
5	Conditionnement
6	Jardin
7	test refacto
8	Autre
\.


--
-- Data for Name: Parent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Parent" (id, label) FROM stdin;
\.


--
-- Data for Name: Status; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Status" (id, label, created_at, updated_at) FROM stdin;
1	demandé	2025-07-30 09:25:18.266	2025-07-30 09:25:18.266
2	en cours	2025-07-30 09:25:18.274	2025-07-30 09:25:18.274
3	terminée	2025-07-30 09:25:18.277	2025-07-30 09:25:18.277
4	ras	2025-07-30 14:37:21.048	2025-07-30 14:37:21.048
5	recommander	2025-08-06 12:01:42.222	2025-08-06 12:01:42.222
6	consommable	2025-08-06 14:15:10.175	2025-08-06 14:15:10.175
7	consommable_a_recomander	2025-08-06 15:39:01.211	2025-08-06 15:39:01.211
\.


--
-- Data for Name: Type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Type" (id, label) FROM stdin;
1	Panne
2	Casse
\.


--
-- Data for Name: Material; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Material" (id, is_store, name, brand, model, description, quantity, registration, serial_number, engine_number, buy_date, comment, picture, mimetype, "serviceId", "categoryId", "statusId", "localisationId", "parentId", "typeId", created_at, updated_at, "parentGroupId", reference) FROM stdin;
55	f	Brouette de sarmentage			\N	0				\N		\N	application/octet-stream	1	1	4	1	\N	\N	2025-07-30 09:31:59.211	2025-08-20 07:01:21.091	\N	\N
25	f	Lame intercept brown	Brown	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	4	\N	\N	\N	2025-07-30 09:31:59.178	2025-08-13 06:47:05.832	\N	\N
26	f	Rogneuse pellenc	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.179	2025-07-30 09:31:59.179	\N	\N
95	t	conso1	conso1	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	1	\N	6	\N	\N	\N	2025-08-06 12:36:52.862	2025-08-06 14:03:10.484	\N	1389al
28	f	Tarriere boisselet	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.182	2025-07-30 09:31:59.182	\N	\N
29	f	Tarriere souslicoff	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.183	2025-07-30 09:31:59.183	\N	\N
30	f	Prétailleuse pellenc	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.184	2025-07-30 09:31:59.184	\N	\N
31	f	Effeuilleuse	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.185	2025-07-30 09:31:59.185	\N	\N
32	f	Pulvé 1035	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.186	2025-07-30 09:31:59.186	\N	\N
33	f	Pulvé mono rang	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.187	2025-07-30 09:31:59.187	\N	\N
34	f	Pulvé tractis	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.189	2025-07-30 09:31:59.189	\N	\N
35	f	Pulvé TS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.19	2025-07-30 09:31:59.19	\N	\N
36	f	Pulvé MT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.191	2025-07-30 09:31:59.191	\N	\N
37	f	Pulvé Tecnoma	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.192	2025-07-30 09:31:59.192	\N	\N
38	f	Machine a tirer les fils	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.193	2025-07-30 09:31:59.193	\N	\N
39	f	Machine a enrouler les fils	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.194	2025-07-30 09:31:59.194	\N	\N
40	f	Epareuse	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.195	2025-07-30 09:31:59.195	\N	\N
41	f	Epareuse taille haie	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.196	2025-07-30 09:31:59.196	\N	\N
42	f	Treuil	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.198	2025-07-30 09:31:59.198	\N	\N
43	f	Machine a soufrée	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.199	2025-07-30 09:31:59.199	\N	\N
47	f	Jeu de griffes double rang	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.203	2025-07-30 09:31:59.203	\N	\N
48	f	Jeu de griffes mono rang	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.204	2025-07-30 09:31:59.204	\N	\N
50	f	Disque braun	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.206	2025-07-30 09:31:59.206	\N	\N
52	f	Cheminé broyeur	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.207	2025-07-30 09:31:59.207	\N	\N
53	f	Charriot épamprage	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.208	2025-07-30 09:31:59.208	\N	\N
54	f	Compresseur effeuilleuse	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.21	2025-07-30 09:31:59.21	\N	\N
56	f	Tarière boisselet	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.211	2025-07-30 09:31:59.211	\N	\N
58	f	Tondeuse Boisselet Coupe 45	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.214	2025-07-30 09:31:59.214	\N	\N
59	f	Tondeuse Boisselet Coupe 50	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.215	2025-07-30 09:31:59.215	\N	\N
8	f	Deca 	Souslikoff		\N	0				\N		\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.156	2025-07-30 09:47:00.263	\N	\N
2	f	Rouleau Beli	Beli		\N	0				\N		\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.148	2025-07-30 09:38:09.765	\N	\N
5	f	Cerveaux moteur boisselet	Boisselet		\N	0				\N		\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.152	2025-07-30 12:53:17.96	\N	\N
46	f	Brouette électrique	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.202	2025-08-20 07:01:23.315	\N	\N
44	f	Baliseuse			\N	0				2025-08-01 00:00:00		\N	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.2	2025-08-20 07:01:28.759	\N	\N
9	f	Deca Boisselet	Boisselet		\N	0				\N		\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.158	2025-07-30 12:43:44.642	\N	\N
51	f	Brouette ma├ºon	test modif marque		\N	0				\N		\N	application/octet-stream	1	\N	4	2	\N	\N	2025-07-30 09:31:59.207	2025-08-07 07:52:40.882	\N	\N
4	f	Rotavator vigne			\N	0				\N		\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.15	2025-07-30 12:53:39.053	\N	\N
20	f	Racleur téflon jaune	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	4	\N	\N	\N	2025-07-30 09:31:59.17	2025-08-20 07:01:35.524	\N	\N
1	f	Rouleau faca	faca		\N	0				\N		\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.136	2025-07-30 12:52:41.883	\N	\N
14	f	Semoir APV	APV	test création	\N	0				\N		\N	application/octet-stream	1	1	\N	\N	\N	\N	2025-07-30 09:31:59.164	2025-07-30 12:57:49.753	\N	\N
3	f	Brosse rotative plastique fait maison			\N	0				\N		\N	application/octet-stream	1	1	4	1	\N	\N	2025-07-30 09:31:59.149	2025-08-20 07:01:18.633	\N	\N
10	f	Deca mono rang			\N	0				\N		\N	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.159	2025-08-20 07:01:53.497	\N	\N
24	f	Rotofil AMG	AMG		\N	0				\N		\\x	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.177	2025-07-30 15:15:46.867	\N	\N
18	f	Buttoir boisselet	Boisselet		\N	0				\N		\N	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.168	2025-08-20 07:01:25.036	\N	\N
12	f	Rogneuse mono rang			\N	0				\N		\N	application/octet-stream	1	1	4	1	\N	\N	2025-07-30 09:31:59.161	2025-07-30 14:47:45.6	\N	\N
21	f	Peigne	Boisselet		\N	0				\N		\N	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.171	2025-07-30 14:55:14.612	\N	\N
7	f	Pelle a remonter les bouts Guyard	test modif marque		\N	0				\N		\N	application/octet-stream	1	1	4	1	\N	\N	2025-07-30 09:31:59.154	2025-07-30 15:06:20.642	\N	\N
13	f	Rogneuse coup eco			\N	0				\N		\\x	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.162	2025-07-31 06:48:10.367	\N	\N
11	f	Rogneuse collar double rang			\N	0				\N		\\x	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.16	2025-07-31 06:48:31.792	\N	\N
15	f	Disque emoteur triple			\N	0				\N		\\x	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.165	2025-07-31 06:51:44.815	\N	\N
17	f	Disque emoteur double			\N	0				\N		\\x	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.167	2025-07-31 06:53:37.679	\N	\N
16	f	Disque boisselet pulvériseur			\N	0				\N	test	\\x	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.166	2025-07-31 06:57:11.448	\N	\N
19	f	Semoir chollet service bleu	\N	\N	\N	\N	\N	\N	\N	\N	\N	\\x	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.169	2025-07-31 07:10:17.437	\N	\N
23	f	Rotofil AVIF	AVIF		\N	0				\N		\\x	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.175	2025-07-31 07:50:17.781	\N	\N
49	f	Disque boisselet	Boisselet	\N	\N	\N	\N	\N	\N	\N	\N	\N	application/octet-stream	1	1	4	\N	\N	\N	2025-07-30 09:31:59.205	2025-07-31 09:31:27.062	\N	\N
106	t	UC MX.1591.4.10			\N	0	\N	\N	\N	\N	\N	\N	\N	1	20	\N	\N	\N	\N	2025-08-07 08:36:32.136	2025-08-07 08:36:32.136	\N	
107	t	SC40015CAG			\N	0	\N	\N	\N	\N	\N	\N	\N	1	21	\N	\N	\N	\N	2025-08-07 08:37:07.447	2025-08-07 08:37:07.447	\N	
108	t	MSE3200	PARKER		\N	0	\N	\N	\N	\N	\N	\N	\N	1	20	\N	\N	\N	\N	2025-08-07 08:37:51.935	2025-08-07 08:37:51.935	\N	
109	t	1470.22.00			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	\N	\N	\N	\N	2025-08-07 08:38:21.491	2025-08-07 08:38:21.491	\N	
110	t	26510353			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	\N	\N	\N	\N	2025-08-07 08:39:22.155	2025-08-07 08:39:22.155	\N	
112	t	1438.22.00			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	\N	\N	\N	\N	2025-08-07 08:40:08.534	2025-08-07 08:40:08.534	\N	
113	t	26510342			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	\N	\N	\N	\N	2025-08-07 08:40:31.283	2025-08-07 08:40:31.283	\N	
114	t	C19460/2			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	\N	\N	\N	\N	2025-08-07 08:40:46.478	2025-08-07 08:40:46.478	\N	
22	f	Brosse métallique boisselet	boisselet		\N	0				\N		\N	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.173	2025-08-28 07:00:50.814	\N	\N
6	f	Arromatic	test 	test modèle	\N	0	n.a	n.a	n.a	2024-12-25 00:00:00		\N	application/octet-stream	1	1	4	3	\N	\N	2025-07-30 09:31:59.153	2025-08-29 06:51:02.828	\N	\N
111	t	1240.05.00			\N	5	\N	\N	\N	\N	\N	\N	\N	1	15	4	\N	\N	\N	2025-08-07 08:39:38.166	2025-08-29 06:55:17.499	\N	
115	t	C13114/4			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	\N	\N	\N	\N	2025-08-07 08:41:05.018	2025-08-07 08:41:05.018	\N	
116	t	AF25618			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	\N	\N	\N	\N	2025-08-07 08:41:36.711	2025-08-07 08:41:36.711	\N	
117	t	K1211-82320			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	\N	\N	\N	\N	2025-08-07 08:41:54.62	2025-08-07 08:41:54.62	\N	
118	t	C15300			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	\N	\N	\N	\N	2025-08-07 08:42:11.598	2025-08-07 08:42:11.598	\N	
119	t	1450.02.00			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:43:01.68	2025-08-07 08:43:01.68	\N	
120	t	26510354			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:43:15.179	2025-08-07 08:43:15.179	\N	
27	f	Broyeur a sarment boisselet	Boisselet		\N	0				\N		\N	application/octet-stream	1	1	4	1	\N	\N	2025-07-30 09:31:59.181	2025-08-20 07:01:43.486	\N	\N
121	t	1250.01.00			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:43:30.109	2025-08-07 08:43:30.109	\N	
122	t	1448.02.00			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:43:43.648	2025-08-07 08:43:43.648	\N	
123	t	26510343			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:44:09.396	2025-08-07 08:44:09.396	\N	
124	t	CF1141			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:44:19.473	2025-08-07 08:44:19.473	\N	
125	t	CF1141/2			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:44:38.933	2025-08-07 08:44:38.933	\N	
126	t	CF600			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:44:54.328	2025-08-07 08:44:54.328	\N	
127	t	AF25957			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:45:10.121	2025-08-07 08:45:10.121	\N	
128	t	CF300			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:45:18.67	2025-08-07 08:45:18.67	\N	
130	t	2654407			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:45:49.828	2025-08-07 08:45:49.828	\N	
131	t	MP10169			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:46:07.708	2025-08-07 08:46:07.708	\N	
132	t	0293-1094			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:46:29.979	2025-08-07 08:46:29.979	\N	
133	t	01174418			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:46:50.471	2025-08-07 08:46:50.471	\N	
134	t	01183574			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:47:06.801	2025-08-07 08:47:06.801	\N	
135	t	AM107423			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:47:27.416	2025-08-07 08:47:27.416	\N	
136	t	LF3614			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:47:38.287	2025-08-07 08:47:38.287	\N	
137	t	HH150-32430			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:47:56.229	2025-08-07 08:47:56.229	\N	
138	t	Kit Deutz 			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:48:34.853	2025-08-07 08:48:34.853	\N	01174416
139	t	26561118			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:48:52.096	2025-08-07 08:48:52.096	\N	
98	t	1252.01.00			\N	0	\N	\N	\N	\N	\N	\N	\N	1	16	\N	\N	\N	\N	2025-08-07 08:09:33.675	2025-08-08 12:58:16.968	\N	
140	t	26560201			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:49:30.667	2025-08-07 08:49:30.667	\N	
141	t	4816636			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:49:42.713	2025-08-07 08:49:42.713	\N	
142	t	MP10326			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:50:08.022	2025-08-07 08:50:08.022	\N	
161	t	axe de vérin			\N	0	\N	\N	\N	\N	\N	\N	\N	1	22	4	\N	\N	\N	2025-08-07 08:59:21.218	2025-08-07 10:07:30.199	\N	E52070
143	t	0293-1449			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:50:26.848	2025-08-07 08:50:26.848	\N	
144	t	01174423			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:50:40.855	2025-08-07 08:50:40.855	\N	
145	t	01180597			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:50:54.672	2025-08-07 08:50:54.672	\N	
146	t	12581-430-0			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:51:16.594	2025-08-07 08:51:16.594	\N	
147	t	02937663			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:51:34.844	2025-08-07 08:51:34.844	\N	
148	t	01174696			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:51:53.009	2025-08-07 08:51:53.009	\N	
149	t	01182242			\N	0	\N	\N	\N	\N	\N	\N	\N	1	18	\N	\N	\N	\N	2025-08-07 08:52:05.298	2025-08-07 08:52:05.298	\N	
150	t	01340130			\N	0	\N	\N	\N	\N	\N	\N	\N	1	19	\N	\N	\N	\N	2025-08-07 08:52:18.283	2025-08-07 08:52:18.283	\N	
151	t	4286843			\N	0	\N	\N	\N	\N	\N	\N	\N	1	19	\N	\N	\N	\N	2025-08-07 08:52:33.472	2025-08-07 08:52:33.472	\N	
152	t	1268085	HYDAC		\N	0	\N	\N	\N	\N	\N	\N	\N	1	20	\N	\N	\N	\N	2025-08-07 08:53:06.91	2025-08-07 08:53:06.91	\N	
154	t	752268			\N	0	\N	\N	\N	\N	\N	\N	\N	1	21	\N	\N	\N	\N	2025-08-07 08:54:16.061	2025-08-07 08:54:16.061	\N	
155	t	SC50022CAG			\N	0	\N	\N	\N	\N	\N	\N	\N	1	21	\N	\N	\N	\N	2025-08-07 08:54:31.215	2025-08-07 08:54:31.215	\N	
156	t	SC50020CAG			\N	0	\N	\N	\N	\N	\N	\N	\N	1	21	\N	\N	\N	\N	2025-08-07 08:54:48.88	2025-08-07 08:54:48.88	\N	
157	t	1988140010			\N	0	\N	\N	\N	\N	\N	\N	\N	1	21	\N	\N	\N	\N	2025-08-07 08:55:01.091	2025-08-07 08:55:01.091	\N	
159	t	axe de paumelle			\N	0	\N	\N	\N	\N	\N	\N	\N	1	22	\N	\N	\N	\N	2025-08-07 08:58:26.702	2025-08-07 08:58:41.196	\N	80028065
160	t	contacteur			\N	0	\N	\N	\N	\N	\N	\N	\N	1	22	\N	\N	\N	\N	2025-08-07 08:58:58.266	2025-08-07 08:58:58.266	\N	DG266
162	t	indicateur de niveau			\N	0	\N	\N	\N	\N	\N	\N	\N	1	22	\N	\N	\N	\N	2025-08-07 08:59:57.355	2025-08-07 08:59:57.355	\N	685689005
163	t	serrure int droite			\N	0	\N	\N	\N	\N	\N	\N	\N	1	22	\N	\N	\N	\N	2025-08-07 09:00:28.497	2025-08-07 09:00:28.497	\N	80029633
164	t	résistance			\N	0	\N	\N	\N	\N	\N	\N	\N	1	22	\N	\N	\N	\N	2025-08-07 09:04:10.012	2025-08-07 09:04:10.012	\N	65740006
166	t	interrupteur on/off clim			\N	0	\N	\N	\N	\N	\N	\N	\N	1	22	\N	\N	\N	\N	2025-08-07 09:06:45.416	2025-08-07 09:06:45.416	\N	80029834
165	t	interrupteur clim			\N	0	\N	\N	\N	\N	\N	\N	\N	1	22	\N	\N	\N	\N	2025-08-07 09:06:07.512	2025-08-07 09:06:56.202	\N	80029839
167	t	vanne chauffage			\N	0	\N	\N	\N	\N	\N	\N	\N	1	22	\N	\N	\N	\N	2025-08-07 09:07:13.774	2025-08-07 09:07:13.774	\N	80029814
169	t	A34			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:08:41.063	2025-08-07 09:08:41.063	\N	
168	t	A34 1/2			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:08:31.864	2025-08-07 09:09:12.56	\N	
170	t	A 33 1/2			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:08:57.307	2025-08-07 09:09:17.772	\N	
171	t	A33			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:09:27.674	2025-08-07 09:09:27.674	\N	
172	t	AVX10X1150LA			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:10:17.609	2025-08-07 09:10:17.609	\N	
173	t	XPA 850			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:10:37.006	2025-08-07 09:10:37.006	\N	
174	t	945 A36			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:10:49.545	2025-08-07 09:10:49.545	\N	
175	t	912 A35			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:11:22.042	2025-08-07 09:11:22.042	\N	
158	t	SC60021CAG			\N	0	\N	\N	\N	\N	\N	\N	\N	1	21	\N	\N	\N	\N	2025-08-07 08:55:19.439	2025-08-07 12:33:05.713	\N	
79	t	matériel magasin	magasin	magasin	\N	28	\N	\N	\N	\N	\N	\N	\N	\N	\N	4	\N	\N	\N	2025-08-01 16:41:02.163	2025-08-11 08:36:53.588	\N	e15a8978
99	t	2654403			\N	0	\N	\N	\N	\N	\N	\N	\N	1	17	\N	\N	\N	\N	2025-08-07 08:10:25.683	2025-08-11 12:01:36.535	\N	
176	t	XPA 1000			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:11:32.888	2025-08-07 09:11:32.888	\N	
177	t	XPA 950A			\N	0	\N	\N	\N	\N	\N	\N	\N	1	23	\N	\N	\N	\N	2025-08-07 09:11:44.617	2025-08-07 09:11:44.617	\N	
178	t	22210EJW33C3			\N	0	\N	\N	\N	\N	\N	\N	\N	1	24	\N	\N	\N	\N	2025-08-07 09:12:44.297	2025-08-07 09:12:44.297	\N	
179	t	22209EJW33C3			\N	0	\N	\N	\N	\N	\N	\N	\N	1	24	\N	\N	\N	\N	2025-08-07 09:15:14.74	2025-08-07 09:15:14.74	\N	
180	t	6207-2RS1/C3			\N	0	\N	\N	\N	\N	\N	\N	\N	1	24	\N	\N	\N	\N	2025-08-07 09:15:45.319	2025-08-07 09:15:45.319	\N	
181	t	6205-2RS-NR			\N	0	\N	\N	\N	\N	\N	\N	\N	1	24	\N	\N	\N	\N	2025-08-07 09:16:06.44	2025-08-07 09:16:06.44	\N	
182	t	32005X			\N	0	\N	\N	\N	\N	\N	\N	\N	1	24	\N	\N	\N	\N	2025-08-07 09:16:17.607	2025-08-07 09:16:17.607	\N	
183	t	30204			\N	0	\N	\N	\N	\N	\N	\N	\N	1	24	\N	\N	\N	\N	2025-08-07 09:16:31.187	2025-08-07 09:16:31.187	\N	
184	t	6004-2RS			\N	0	\N	\N	\N	\N	\N	\N	\N	1	24	\N	\N	\N	\N	2025-08-07 09:16:46.871	2025-08-07 09:16:46.871	\N	
185	t	6304DDU			\N	0	\N	\N	\N	\N	\N	\N	\N	1	24	\N	\N	\N	\N	2025-08-07 09:17:10.218	2025-08-07 09:17:10.218	\N	
186	t	6303DDU			\N	0	\N	\N	\N	\N	\N	\N	\N	1	24	\N	\N	\N	\N	2025-08-07 09:17:20.671	2025-08-07 09:17:20.671	\N	
187	t	30 x 4 x 7			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:21:22.626	2025-08-07 09:21:35.089	\N	
188	t	18 x 30 x 7			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:21:49.979	2025-08-07 09:21:49.979	\N	
189	t	18 x 28 x 7			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:22:12.87	2025-08-07 09:22:12.87	\N	
190	t	30 x 52 x 7			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:22:26.853	2025-08-07 09:22:26.853	\N	
191	t	20 x 35 x 7			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:22:43.061	2025-08-07 09:22:43.061	\N	
192	t	58 x 75 x 5			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:22:55.691	2025-08-07 09:22:55.691	\N	
193	t	55 x 90 x 10			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:23:08.271	2025-08-07 09:23:08.271	\N	
194	t	40 x 62 x 7			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:23:25.926	2025-08-07 09:23:25.926	\N	
195	t	36 x 47 x 7			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:23:39.376	2025-08-07 09:23:39.376	\N	
197	t	12 x 22 x 8			\N	0	\N	\N	\N	\N	\N	\N	\N	1	25	\N	\N	\N	\N	2025-08-07 09:24:06.166	2025-08-07 09:24:06.166	\N	
198	t	80029720			\N	0	\N	\N	\N	\N	\N	\N	\N	1	26	\N	\N	\N	\N	2025-08-07 09:26:42.523	2025-08-07 09:26:42.523	\N	
45	f	Broyeur thermique RABOT	RABOT		\N	0				\N		\N	application/octet-stream	1	\N	4	1	\N	\N	2025-07-30 09:31:59.201	2025-08-05 14:16:03.781	\N	\N
206	t	test conso	test conso	\N	\N	0	\N	\N	\N	\N	\N	\N	\N	1	\N	6	\N	\N	\N	2025-08-11 12:50:11.857	2025-08-11 12:50:11.857	\N	test13
227	f	Groupe Froid château			\N	0				2025-08-11 00:00:00		\N		2	62	4	3	\N	\N	2025-08-19 07:49:44.315	2025-08-19 07:49:44.315	\N	\N
228	f	Groupe Froid FDL			\N	0				2025-08-11 00:00:00		\N		2	62	4	1	\N	\N	2025-08-19 07:50:06.837	2025-08-19 07:50:06.837	\N	\N
230	f	Cellule HT bâtiment principal			\N	0				2025-08-11 00:00:00		\N		2	63	4	2	\N	\N	2025-08-19 07:51:22.511	2025-08-19 07:51:22.511	\N	\N
211	f	Echangeur primaire/secondaire local CTA			\N	0				2025-08-11 00:00:00		\N		2	55	4	3	\N	\N	2025-08-18 14:57:42.388	2025-08-19 10:17:43.462	\N	\N
232	f	Transfo bâtiment principal			\N	0				2025-08-11 00:00:00		\N		2	63	4	3	\N	\N	2025-08-19 07:52:01.975	2025-08-19 07:52:01.975	\N	\N
235	f	Adoucisseur condi			\N	0				2025-08-11 00:00:00		\N		2	64	4	5	\N	\N	2025-08-19 07:53:29.493	2025-08-19 13:00:34.584	\N	\N
233	f	Adoucisseur local CTA			\N	0				2025-08-11 00:00:00		\N		2	64	4	2	\N	\N	2025-08-19 07:52:57.099	2025-08-19 07:52:57.099	\N	\N
212	f	Pompe Barriquand local CTA R-1			\N	0				2025-08-11 00:00:00		\N		2	56	4	3	\N	\N	2025-08-18 14:58:25.494	2025-08-18 15:04:01.491	\N	\N
217	f	Gerbeur Atelier 1			\N	0				2025-08-11 00:00:00		\N		2	58	4	2	\N	\N	2025-08-19 07:42:43.897	2025-08-19 07:42:43.897	\N	\N
218	f	Gerbeur Atelier 2			\N	0				2025-08-11 00:00:00		\N		2	58	4	2	\N	\N	2025-08-19 07:42:59.989	2025-08-19 07:42:59.989	\N	\N
219	f	Frontal Atelier			\N	0				2025-08-11 00:00:00		\N		2	59	4	2	\N	\N	2025-08-19 07:43:50.061	2025-08-19 07:43:50.061	\N	\N
221	f	Frontal condi			\N	0				2025-08-11 00:00:00		\N		2	60	4	2	\N	\N	2025-08-19 07:45:46.874	2025-08-19 07:45:46.874	\N	\N
223	f	Lève-barrique			\N	0				2025-08-11 00:00:00		\N		2	60	4	2	\N	\N	2025-08-19 07:46:37.277	2025-08-19 07:46:37.277	\N	\N
224	f	Palan Atelier			\N	0				2025-08-11 00:00:00		\N		2	61	4	2	\N	\N	2025-08-19 07:47:17.995	2025-08-19 07:47:17.995	\N	\N
225	f	Palan loge soudure			\N	0				2025-08-11 00:00:00		\N		2	61	4	2	\N	\N	2025-08-19 07:47:36.191	2025-08-19 07:47:36.191	\N	\N
234	f	Adoucisseur salle dégustation 1			\N	0				2025-08-11 00:00:00		\N		2	64	4	3	\N	\N	2025-08-19 07:53:11.416	2025-08-19 07:53:11.416	\N	\N
236	f	Adoucisseur chaufferie			\N	0				2025-08-11 00:00:00		\N		2	64	4	3	\N	\N	2025-08-19 07:53:47.628	2025-08-19 07:53:47.628	\N	\N
237	f	Osmoseur R-1			\N	0				2025-08-11 00:00:00		\N		2	64	4	3	\N	\N	2025-08-19 07:54:00.797	2025-08-19 07:54:00.797	\N	\N
238	f	Arkal 1			\N	0				2025-08-11 00:00:00		\N		2	65	4	3	\N	\N	2025-08-19 07:54:59.196	2025-08-19 07:54:59.196	\N	\N
239	f	Arkal 2			\N	0				2025-08-11 00:00:00		\N		2	65	4	3	\N	\N	2025-08-19 07:55:15.768	2025-08-19 07:55:15.768	\N	\N
240	f	Suppresseurs PR2			\N	0				2025-08-11 00:00:00		\N		2	66	4	2	\N	\N	2025-08-19 07:55:48.204	2025-08-19 07:55:48.204	\N	\N
241	f	Relevage PR1			\N	0				2025-08-11 00:00:00		\N		2	66	4	2	\N	\N	2025-08-19 07:56:01.755	2025-08-19 07:56:01.755	\N	\N
242	f	Relevage PR3			\N	0				2025-08-11 00:00:00		\N		2	66	4	2	\N	\N	2025-08-19 07:56:20.539	2025-08-19 07:56:20.539	\N	\N
243	f	Armoire surpresseur			\N	0				2025-08-11 00:00:00		\N		2	66	4	2	\N	\N	2025-08-19 07:56:34.343	2025-08-19 07:56:34.343	\N	\N
244	f	Ballon expansion 200L			\N	0				2025-08-11 00:00:00		\N		2	66	4	2	\N	\N	2025-08-19 07:56:48.038	2025-08-19 07:56:48.038	\N	\N
229	f	Cellule HT jardin			\N	0				2025-08-11 00:00:00		\N		2	63	4	6	\N	\N	2025-08-19 07:51:05.361	2025-08-19 13:00:54.378	\N	\N
231	f	Transfo jardin			\N	0				2025-08-11 00:00:00		\N		2	63	4	6	\N	\N	2025-08-19 07:51:40.636	2025-08-19 13:01:03.018	\N	\N
208	f	CTA Chai barrique 2			\N	0				2025-08-11 00:00:00		\N		2	54	4	4	\N	\N	2025-08-18 14:53:01.236	2025-08-19 12:58:34.075	\N	\N
220	f	Frontal FDL			\N	0				2025-08-11 00:00:00		\N		2	59	4	1	\N	\N	2025-08-19 07:44:32.465	2025-08-19 13:01:19.346	\N	\N
226	f	Groupe Froid Daikin jardin			\N	0				2025-08-11 00:00:00		\N		2	62	4	6	\N	\N	2025-08-19 07:48:58.181	2025-08-19 13:01:28.742	\N	\N
202	t	huile test	test	\N	\N	15	\N	\N	\N	\N	\N	\N	\N	1	\N	6	\N	\N	\N	2025-08-11 12:38:43.222	2025-08-27 12:52:45.271	\N	1234
80	t	magasin name	brand	magasin model	\N	68	\N	\N	\N	\N	\N	\N	\N	\N	\N	4	\N	\N	\N	2025-08-01 16:57:27.136	2025-08-27 12:53:48.251	\N	1389al
105	t	1242.05.00			\N	0	\N	\N	\N	\N	\N	\N	\N	1	15	4	\N	\N	\N	2025-08-07 08:35:52.981	2025-08-27 12:55:34.725	\N	
57	f	Rol'n sem			\N	0				\N		\N	application/octet-stream	1	1	4	2	\N	\N	2025-07-30 09:31:59.213	2025-08-27 12:59:13.828	\N	\N
204	t	huile test bis	test	\N	\N	0	\N	\N	\N	\N	\N	\N	\N	1	\N	6	\N	\N	\N	2025-08-11 12:42:49.695	2025-08-29 06:55:57.298	\N	1234
210	f	CTA chai bouteille 1&2			\N	0				2025-08-11 00:00:00		\N		2	54	4	4	\N	\N	2025-08-18 14:53:32.399	2025-08-29 07:01:20.584	\N	\N
207	f	CTA Chai barrique 1			\N	0				2025-08-04 00:00:00		\N		2	54	4	4	\N	\N	2025-08-18 14:52:36.613	2025-09-11 12:25:40.756	\N	\N
222	f	Frontal Chai			\N	0				2025-08-11 00:00:00		\N		2	60	4	2	\N	\N	2025-08-19 07:46:04.666	2025-09-11 12:27:26.726	\N	\N
\.


--
-- Data for Name: Documentation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Documentation" (id, title, file, mimetype, "materialId") FROM stdin;
\.


--
-- Data for Name: Priority; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Priority" (id, label) FROM stdin;
1	urgent
2	très urgent
3	classique
\.


--
-- Data for Name: Intervention; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Intervention" (id, title, description, initial_comment, final_comment, begin_date, picture, mimetype, "serviceId", "localisationId", "statusId", "categoryId", "priorityId", "typeId", created_at, updated_at, requestor_firstname, requestor_lastname) FROM stdin;
1	test 1	test 1	\N	ras	\N	\\x	\N	1	\N	3	1	2	\N	2025-07-30 09:33:55.348	2025-07-30 09:35:45.073	Lagutere	Arnaud
3	Test Intervention	test	\N	ras	\N	\\x	\N	1	2	3	1	2	1	2025-07-30 14:02:05.986	2025-07-30 14:07:07.911	Lagutere	Arnaud
12	Titre intervention demande	test demandeur	\N	\N	\N	\\x	\N	\N	1	1	\N	2	1	2025-07-31 08:55:03.939	2025-07-31 08:55:03.939	Lagutere	Arnaud
32	test intervention socket	test	\N	ras	\N	\\x	\N	1	2	3	\N	2	1	2025-08-11 08:38:58.046	2025-08-11 08:40:46.703	arnaud	lagutere
18	test demande	test	\N	ras	\N	\\x	\N	1	1	3	\N	2	2	2025-07-31 12:17:35.697	2025-07-31 12:35:19.63	Lagutere	Arnaud
19	test création new	test création new	\N	ras	\N	\\x	\N	1	3	3	\N	3	1	2025-07-31 12:34:33.616	2025-07-31 12:35:25.514	Lagutere	Arnaud
9	Test Intervention	test test	\N	ras	\N	\\x	\N	1	2	3	\N	2	2	2025-07-30 14:21:30.748	2025-07-31 12:35:47.146	Lagutere	Arnaud
33	test intervention socket bis	test	\N	ras	\N	\\x	\N	1	2	3	\N	2	1	2025-08-11 08:43:50.621	2025-08-11 08:44:38.942	arnaud	lagutere
10	bruit étrange	bruit étrange climatisation	\N	ras	\N	\\x	\N	1	3	3	\N	1	1	2025-07-31 08:00:55.472	2025-08-01 07:29:42.915	Lagutere	Arnaud
23	test2 depuis matériel	test création depuis matériel	\N	ras	\N	\\x	\N	1	1	3	\N	2	1	2025-08-01 06:40:45.969	2025-08-01 07:52:12.161	Lagutere	Arnaud
7	Test Intervention	tst	\N	ras	\N	\\x	\N	1	2	3	1	2	1	2025-07-30 14:05:20.721	2025-08-01 09:00:36.508	Lagutere	Arnaud
17	Titre intervention demande	test	\N	ras	\N	\\x	\N	1	1	3	\N	2	1	2025-07-31 09:09:50.401	2025-08-01 09:19:36.348	Lagutere	Arnaud
25	Titre intervention demande atelier	ne fonctionne plus	\N	\N	\N	\\x	\N	1	2	2	\N	1	2	2025-08-04 12:36:47.946	2025-08-04 12:38:49.907	Lagutere	Arnaud
4	Test Intervention	test	\N	ras	\N	\\x	\N	1	2	3	1	1	1	2025-07-30 14:02:26.671	2025-08-04 12:56:10.953	Lagutere	Arnaud
26	testDemande	panne climatisation	\N	ras	\N	\\x	\N	1	2	3	\N	1	1	2025-08-07 07:47:46.851	2025-08-07 07:48:27.006	Lagutere	Arnaud
6	Test Intervention	test	\N	\N	\N	\\x	\N	1	2	2	1	3	1	2025-07-30 14:03:53.133	2025-08-07 12:57:52.943	Lagutere	Arnaud
22	Titre intervention demande atelier	tes description atelier	\N	ras	\N	\\x	\N	1	1	3	\N	2	1	2025-08-01 06:38:15.394	2025-08-07 13:01:29.785	Lagutere	Arnaud
30	test inter	test	\N	ras	\N	\\x	\N	2	2	3	\N	2	1	2025-08-07 14:40:51.795	2025-08-21 10:26:34.289	arnaud	lagutere
27	brosse cassée	la brosse est cassée	\N	ras	\N	\\x	\N	1	2	3	\N	2	2	2025-08-07 13:00:58.781	2025-08-21 12:10:31.443	Lagutere	Arnaud
11	Titre intervention	Description intervention	\N	ras	\N	\\x	\N	1	1	3	\N	2	1	2025-07-31 08:16:01.149	2025-08-21 12:19:41.913	Lagutere	Arnaud
40	test pwa	tes	\N	\N	\N	\\x	\N	1	2	2	\N	2	1	2025-08-21 13:24:22.36	2025-08-27 12:50:58.638	arnaud	lagutere
24	Titre intervention demande atelier	ne fonctionne plus 	\N	ras	\N	\\x	\N	1	1	3	\N	2	1	2025-08-04 09:35:23.907	2025-08-27 12:51:19.058	Lagutere	Arnaud
44	Test  demande intervention	test	\N	\N	\N	\\x	\N	1	2	1	\N	2	1	2025-08-27 13:03:09.042	2025-08-27 13:03:09.042	Lagutere	Arnaud
45	Test  demande intervention	test	\N	\N	\N	\\x	\N	1	2	1	\N	\N	1	2025-08-27 13:03:23.092	2025-08-27 13:03:23.092	Lagutere	Arnaud
47	Test  demande intervention	test	\N	\N	\N	\\x	\N	1	2	1	\N	2	1	2025-08-27 13:04:56.289	2025-08-27 13:04:56.289	Lagutere	Arnaud
49	test 28	test	\N	\N	\N	\\x	\N	1	2	1	\N	2	1	2025-08-28 06:17:51.178	2025-08-28 06:17:51.178	nowak	lisot
28	test	test	\N	\N	\N	\\x	\N	1	1	2	\N	1	2	2025-08-07 13:07:15.277	2025-08-29 06:45:14.211	Lagutere	Arnaud
35	test refacto	refact test	\N	ras	\N	\\x	\N	1	\N	3	\N	2	1	2025-08-19 14:11:35.695	2025-08-29 06:46:11.055		
50	test0209	0209	\N	\N	\N	\\x	\N	1	8	1	\N	3	1	2025-09-02 07:13:47.021	2025-09-02 07:13:47.021	nowak	lisot
52	chiottes bouchées	azeazgaera	\N	\N	\N	\\x	\N	2	\N	1	\N	3	1	2025-09-11 12:22:16.758	2025-09-11 12:22:16.758	Simon	Maglione
53	Chiottes bouchées	prout	\N	\N	\N	\\x	\N	2	4	1	\N	1	1	2025-09-11 12:32:43.35	2025-09-11 12:32:43.35	Simon	Maglione 
\.


--
-- Data for Name: MaterialIntervention; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MaterialIntervention" (id, "materialId", "interventionId") FROM stdin;
1	55	1
9	6	9
10	20	10
11	44	11
14	44	17
15	6	18
16	6	19
19	44	22
21	5	24
22	5	25
23	6	26
24	22	27
25	22	28
29	6	32
30	6	33
32	22	35
37	6	40
40	223	44
42	223	47
44	236	53
\.


--
-- Data for Name: Preventive; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Preventive" (id, title, description, process, date, "serviceId", created_at, updated_at, "statusId") FROM stdin;
21	test	test	\N	2025-08-13 00:00:00	1	2025-08-12 09:38:48.688	2025-08-14 07:53:06.75	3
20	prévent	test	\N	2025-10-13 00:00:00	1	2025-08-12 09:28:31.478	2025-08-14 07:58:08.192	3
19	test date	test	\N	2025-08-14 00:00:00	1	2025-08-12 09:25:33.832	2025-08-18 07:16:01.797	3
24	préventif test 12	Gérez et suivez les interventions pour gagner du temps et prendre soin de vos salariés\nMaintenance préventive ┬À Démo interactive ┬À Expérience optimale\n\nProduit : Statistiques ┬À Tarifs ┬À Découvrir Notre Produit	\N	2025-08-27 00:00:00	1	2025-08-14 08:03:13.776	2025-08-18 07:16:07.11	3
25	test refacto préventif	test	\N	2025-08-26 00:00:00	2	2025-08-19 14:58:58.384	2025-08-19 15:00:42.406	3
26	test refacto préventif	test refacto	\N	2025-08-26 00:00:00	1	2025-08-20 07:52:02.999	2025-08-21 12:09:09.591	3
27	préventif test refacto	test 	\N	2025-08-29 00:00:00	1	2025-08-21 12:00:37.377	2025-08-21 12:09:57.701	2
12	test préventif proche	description	\N	2025-08-12 00:00:00	1	2025-08-11 07:53:24.845	2025-08-12 09:49:08.159	3
23	test	test	\N	2025-08-13 00:00:00	2	2025-08-12 13:48:24.025	2025-08-12 13:48:42.893	3
29	préventif	test	\N	2025-10-22 00:00:00	1	2025-08-27 12:59:59.186	2025-08-27 13:00:39.6	3
30	test préventif	test	\N	2025-09-05 00:00:00	1	2025-08-29 06:48:11.518	2025-08-29 06:49:06.628	3
31	prout	prout	\N	2025-09-12 00:00:00	2	2025-09-11 12:37:23.887	2025-09-11 12:37:23.887	1
\.


--
-- Data for Name: MaterialPreventive; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MaterialPreventive" (id, "materialId", "preventiveId") FROM stdin;
12	44	12
19	39	19
20	6	20
21	46	21
24	53	24
25	236	25
26	6	26
29	20	29
30	6	30
31	236	31
\.


--
-- Data for Name: Movement; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Movement" (id, is_incoming, is_outgoing, "materialId", created_at, updated_at, quantity) FROM stdin;
1	t	f	80	2025-08-04 10:23:55.225	2025-08-04 10:23:55.225	50
2	f	t	79	2025-08-04 10:30:24.364	2025-08-04 10:30:24.364	2
3	f	t	80	2025-08-04 10:37:04.415	2025-08-04 10:37:04.415	1
4	f	t	80	2025-08-04 11:52:00.119	2025-08-04 11:52:00.119	10
5	t	f	79	2025-08-04 14:29:46.494	2025-08-04 14:29:46.494	50
6	t	f	80	2025-08-04 14:49:55.143	2025-08-04 14:49:55.143	10
7	t	f	79	2025-08-04 14:49:55.163	2025-08-04 14:49:55.163	10
8	t	f	80	2025-08-04 14:58:06.891	2025-08-04 14:58:06.891	15
9	t	f	79	2025-08-04 14:58:06.909	2025-08-04 14:58:06.909	5
10	t	f	80	2025-08-04 14:58:41.093	2025-08-04 14:58:41.093	25
11	f	t	79	2025-08-06 07:24:01.358	2025-08-06 07:24:01.358	50
12	f	t	80	2025-08-06 07:24:49.941	2025-08-06 07:24:49.941	29
14	f	t	80	2025-08-06 07:25:57.639	2025-08-06 07:25:57.639	1
34	t	f	79	2025-08-06 08:13:13.557	2025-08-06 08:13:13.557	1
35	f	t	79	2025-08-06 08:14:06.797	2025-08-06 08:14:06.797	3
15	t	f	\N	2025-08-06 07:27:01.754	2025-08-06 07:27:01.754	10
16	f	t	\N	2025-08-06 07:29:56.756	2025-08-06 07:29:56.756	1
17	t	f	\N	2025-08-06 07:30:58.632	2025-08-06 07:30:58.632	1
18	t	f	\N	2025-08-06 07:37:56.146	2025-08-06 07:37:56.146	2
19	t	f	\N	2025-08-06 07:40:07.803	2025-08-06 07:40:07.803	4
20	t	f	\N	2025-08-06 07:43:58.337	2025-08-06 07:43:58.337	2
21	t	f	\N	2025-08-06 07:44:15.12	2025-08-06 07:44:15.12	2
22	t	f	\N	2025-08-06 07:46:28.505	2025-08-06 07:46:28.505	1
23	t	f	\N	2025-08-06 07:50:29.513	2025-08-06 07:50:29.513	2
24	t	f	\N	2025-08-06 07:52:59.494	2025-08-06 07:52:59.494	1
25	f	t	\N	2025-08-06 07:53:54.057	2025-08-06 07:53:54.057	1
26	t	f	\N	2025-08-06 07:58:43.995	2025-08-06 07:58:43.995	1
27	t	f	\N	2025-08-06 08:00:27.246	2025-08-06 08:00:27.246	1
28	t	f	\N	2025-08-06 08:04:32.27	2025-08-06 08:04:32.27	1
29	t	f	\N	2025-08-06 08:04:53.53	2025-08-06 08:04:53.53	2
30	t	f	\N	2025-08-06 08:07:40.137	2025-08-06 08:07:40.137	2
38	f	t	79	2025-08-06 10:21:58.811	2025-08-06 10:21:58.811	10
40	f	t	79	2025-08-06 11:56:41.813	2025-08-06 11:56:41.813	10
44	f	t	79	2025-08-06 13:15:44.658	2025-08-06 13:15:44.658	5
47	f	t	79	2025-08-06 13:50:24.658	2025-08-06 13:50:24.658	1
48	f	t	79	2025-08-07 07:45:10.536	2025-08-07 07:45:10.536	10
13	f	t	\N	2025-08-06 07:25:22.071	2025-08-06 07:25:22.071	5
31	t	f	\N	2025-08-06 08:10:08.184	2025-08-06 08:10:08.184	5
32	t	f	\N	2025-08-06 08:12:22.299	2025-08-06 08:12:22.299	10
33	t	f	\N	2025-08-06 08:12:35.89	2025-08-06 08:12:35.89	1
36	f	t	\N	2025-08-06 08:14:23.865	2025-08-06 08:14:23.865	1
37	f	t	\N	2025-08-06 10:10:59.903	2025-08-06 10:10:59.903	5
39	f	t	\N	2025-08-06 11:52:37.525	2025-08-06 11:52:37.525	10
41	f	t	\N	2025-08-06 12:10:04.577	2025-08-06 12:10:04.577	5
42	t	f	\N	2025-08-06 12:10:29.834	2025-08-06 12:10:29.834	55
43	t	f	\N	2025-08-06 12:51:53.976	2025-08-06 12:51:53.976	10
45	f	t	\N	2025-08-06 13:23:04.361	2025-08-06 13:23:04.361	1
46	f	t	\N	2025-08-06 13:28:25.855	2025-08-06 13:28:25.855	1
49	f	t	79	2025-08-11 08:36:02.554	2025-08-11 08:36:02.554	1
50	t	f	79	2025-08-11 08:36:53.618	2025-08-11 08:36:53.618	15
51	f	t	80	2025-08-27 12:53:38.213	2025-08-27 12:53:38.213	1
52	t	f	105	2025-08-27 12:54:52.015	2025-08-27 12:54:52.015	10
53	f	t	105	2025-08-27 12:55:14.145	2025-08-27 12:55:14.145	5
54	f	t	105	2025-08-27 12:55:34.784	2025-08-27 12:55:34.784	5
55	t	f	111	2025-08-29 06:54:35.469	2025-08-29 06:54:35.469	10
56	f	t	111	2025-08-29 06:55:03.601	2025-08-29 06:55:03.601	5
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Role" (id, label) FROM stdin;
1	demandeur
2	technicien
3	responsable
4	administrateur
\.


--
-- Data for Name: StatusIntervention; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StatusIntervention" (id, "statusId", "interventionId", comment, date) FROM stdin;
1	1	1	\N	2025-07-30 09:33:55.371
3	1	3	\N	2025-07-30 14:02:06.038
4	1	4	\N	2025-07-30 14:02:26.696
6	1	6	\N	2025-07-30 14:03:53.153
7	1	7	\N	2025-07-30 14:05:20.925
9	1	9	\N	2025-07-30 14:21:30.846
10	1	10	\N	2025-07-31 08:00:55.538
11	1	11	\N	2025-07-31 08:16:01.223
12	1	12	\N	2025-07-31 08:55:04.009
17	1	17	\N	2025-07-31 09:09:50.46
18	1	18	\N	2025-07-31 12:17:35.728
19	1	19	\N	2025-07-31 12:34:33.644
22	1	22	\N	2025-08-01 06:38:15.416
23	1	23	\N	2025-08-01 06:40:46.003
24	1	24	\N	2025-08-04 09:35:23.932
25	1	25	\N	2025-08-04 12:36:47.972
26	1	26	\N	2025-08-07 07:47:46.883
27	1	27	\N	2025-08-07 13:00:58.819
28	1	28	\N	2025-08-07 13:07:15.319
30	1	30	\N	2025-08-07 14:40:51.915
32	1	32	\N	2025-08-11 08:38:58.091
33	1	33	\N	2025-08-11 08:43:50.655
35	1	35	\N	2025-08-19 14:11:35.788
40	1	40	\N	2025-08-21 13:24:22.396
42	1	44	\N	2025-08-27 13:03:09.054
43	1	45	\N	2025-08-27 13:03:23.103
45	1	47	\N	2025-08-27 13:04:56.3
47	1	49	\N	2025-08-28 06:17:51.19
48	1	50	\N	2025-09-02 07:13:47.057
50	1	52	\N	2025-09-11 12:22:16.768
51	1	53	\N	2025-09-11 12:32:43.369
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, lastname, firstname, email, password, "roleId", "serviceId", created_at, updated_at, validation_code) FROM stdin;
2	TechnicienTest	TechnicienTest	technicien@test.io	password	2	1	2025-08-01 09:28:22.505	2025-08-13 08:42:26.75	1389
1	Lagutere	Arnaud 	test@test.io	$argon2id$v=19$m=65536,t=3,p=4$F6VSuNcwjS1jCiq53beBOQ$UBbOxNe397KeG67TvamMpWCzyN/JW+phPlhs3nfTnL0	4	1	2025-07-30 11:35:21.845	2025-08-14 10:33:31.247	1111
29	test ajout	test ajout	ajout@test.io	$argon2id$v=19$m=65536,t=3,p=4$dyj0WqZfPsmJppBAaRQgQQ$dW4MlXsGA7EW+oLerIbm9Tto6NyZ+vQyE9qtDCebeNM	2	1	2025-08-21 12:25:55.917	2025-08-21 12:25:55.917	5555
\.


--
-- Data for Name: UserIntervention; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserIntervention" (id, "interventionId", "userId") FROM stdin;
1	17	1
2	10	2
3	7	2
4	7	1
5	17	2
6	25	1
7	4	2
8	4	1
9	11	1
10	11	2
11	26	1
12	26	2
13	6	1
14	6	2
15	24	1
16	27	1
17	32	2
18	32	1
19	33	1
20	30	1
21	30	2
22	27	2
23	25	2
24	35	1
25	40	2
26	28	1
27	35	2
\.


--
-- Data for Name: UserPreventive; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserPreventive" (id, "preventiveId", "userId") FROM stdin;
1	20	1
2	19	2
3	24	2
4	25	1
5	26	1
6	27	1
7	29	1
8	30	1
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ff43fda4-3663-4ea3-87fd-1bc5921029c2	fd40eb0e7541aa781c35f9e2e578e8be61cd310047556fc4a00561d90e647197	2025-08-27 12:27:43.146792+00	20250717070949_init	\N	\N	2025-08-27 12:27:43.022298+00	1
115c9a11-fae8-43ea-80f4-fdf6b9124175	f3429595afd09e5a703eda8994934ba93f1dff815e11d1d5cc8d32a307bcd822	2025-08-27 12:27:43.24457+00	20250818124720_add_service_to_category_table	\N	\N	2025-08-27 12:27:43.237582+00	1
42cfd65a-38f0-4e59-ae3e-39f340f53ca4	404a59a3ba13124ff1f809e8d0308c51f325ff2aa5305c0f286bc2b4219db0ec	2025-08-27 12:27:43.15196+00	20250717074340_add_unique_to_status_label	\N	\N	2025-08-27 12:27:43.14748+00	1
242f1161-7456-405c-bb85-cadf4039c553	fd40eb0e7541aa781c35f9e2e578e8be61cd310047556fc4a00561d90e647197	2025-07-30 09:23:16.338207+00	20250717070949_init	\N	\N	2025-07-30 09:23:16.27664+00	1
50cc79c5-0922-4260-90db-704d90c21ab1	cc24ad49bdd6927a58e1a0f781a74333c00212bc70501a9c5ed6a4b9d615c672	2025-08-27 12:27:43.169012+00	20250717075220_add_unique_label	\N	\N	2025-08-27 12:27:43.152677+00	1
a83e888e-dfd8-4cdf-be24-e0a3c7d4f221	404a59a3ba13124ff1f809e8d0308c51f325ff2aa5305c0f286bc2b4219db0ec	2025-07-30 09:23:16.340775+00	20250717074340_add_unique_to_status_label	\N	\N	2025-07-30 09:23:16.338612+00	1
7d76efb1-f9d5-4516-add6-66d5c79b42cd	e21fc8b084a546ad0d6cc00f3b34543fd713f3ec42048ebc560923f0cd998f0b	2025-08-27 12:27:43.174825+00	20250717075813_modify_mimetype_material	\N	\N	2025-08-27 12:27:43.172052+00	1
9c9c0c54-b97a-44fc-b5f6-402bcdc58add	f3429595afd09e5a703eda8994934ba93f1dff815e11d1d5cc8d32a307bcd822	2025-08-18 12:47:20.683486+00	20250818124720_add_service_to_category_table	\N	\N	2025-08-18 12:47:20.667865+00	1
e905cb7f-e80f-4073-8ba8-653fa35094b1	8c1ec64aca0bf47ce17df2b0f727ed21bdf6e7856cc04676e8b7a35a2f4493f2	2025-08-27 12:27:43.179962+00	20250717082030_modify_name_unique_material	\N	\N	2025-08-27 12:27:43.175569+00	1
2835e0d1-d3ca-473b-b45c-84317261f4ed	cc24ad49bdd6927a58e1a0f781a74333c00212bc70501a9c5ed6a4b9d615c672	2025-07-30 09:23:16.34573+00	20250717075220_add_unique_label	\N	\N	2025-07-30 09:23:16.341081+00	1
3d40b7ac-a1d0-40d4-ab01-9c0c84ca8017	716fffd3810ea779147868dd76badb8fb0a2b48fa71ffc39618503e7c13d6e87	2025-08-27 12:27:43.197899+00	20250730093131_create_material_table	\N	\N	2025-08-27 12:27:43.180658+00	1
9af2d36f-210d-4dfc-8f51-fd4eb9291739	e21fc8b084a546ad0d6cc00f3b34543fd713f3ec42048ebc560923f0cd998f0b	2025-07-30 09:23:16.348758+00	20250717075813_modify_mimetype_material	\N	\N	2025-07-30 09:23:16.346229+00	1
91e39150-9c6d-4c3d-8adf-535af6f5a0fc	7c1d69ce3c64df737a60776764b98c12f7ea534fbbfa78e89d8248bdf1ce7a73	2025-08-27 12:27:43.20096+00	20250801123541_add_reference_to_material	\N	\N	2025-08-27 12:27:43.198551+00	1
76a1204e-4707-47a4-a121-5a305ae9cc17	8c1ec64aca0bf47ce17df2b0f727ed21bdf6e7856cc04676e8b7a35a2f4493f2	2025-07-30 09:23:16.353572+00	20250717082030_modify_name_unique_material	\N	\N	2025-07-30 09:23:16.349398+00	1
9c156103-8551-4088-b00a-62e062365c11	da9ebf49cb6c69937e89977908dc90ce1b06689287896ab9ff14ebd7b45d9c21	2025-08-27 12:27:43.204773+00	20250804092336_add_date_to_movement	\N	\N	2025-08-27 12:27:43.201672+00	1
16a38fd3-6a66-4604-95fc-7c4e2c4e8926	716fffd3810ea779147868dd76badb8fb0a2b48fa71ffc39618503e7c13d6e87	2025-07-30 09:31:31.934199+00	20250730093131_create_material_table	\N	\N	2025-07-30 09:31:31.921425+00	1
91bca359-69a1-4590-a751-31d039aa2c10	0cb9e36fe3f7bf3358650ad5f8e06c4571a572467dbc97fcbddb61327353ed3f	2025-08-27 12:27:43.207903+00	20250804093031_add_quantity_to_movement	\N	\N	2025-08-27 12:27:43.205559+00	1
6076cb76-638f-4216-812f-0436667c140e	7c1d69ce3c64df737a60776764b98c12f7ea534fbbfa78e89d8248bdf1ce7a73	2025-08-01 12:35:41.451752+00	20250801123541_add_reference_to_material	\N	\N	2025-08-01 12:35:41.443702+00	1
0918b5d1-5a35-4472-ace5-e86376c2b4e7	25dbcf85371e27424040acc59e6226706afda9eec6671feefe793998ae79299a	2025-08-27 12:27:43.214082+00	20250811075007_add_delete_cascade_preventive	\N	\N	2025-08-27 12:27:43.208536+00	1
8ea3c7b0-293d-472c-9b61-a4dbe9152c31	da9ebf49cb6c69937e89977908dc90ce1b06689287896ab9ff14ebd7b45d9c21	2025-08-04 09:23:36.24506+00	20250804092336_add_date_to_movement	\N	\N	2025-08-04 09:23:36.234598+00	1
f4f51844-521d-4c84-a7cb-c26f40f5825c	8bf2f29423f71d43ac9be34844145cf458e7a0743d1836182c4e8b15ce00e175	2025-08-27 12:27:43.219354+00	20250812065757_add_status_to_preventive	\N	\N	2025-08-27 12:27:43.214825+00	1
e7dfb3a7-c690-41bd-b296-7beb9fcdb2b7	0cb9e36fe3f7bf3358650ad5f8e06c4571a572467dbc97fcbddb61327353ed3f	2025-08-04 09:30:31.873723+00	20250804093031_add_quantity_to_movement	\N	\N	2025-08-04 09:30:31.867444+00	1
5b5abe9c-ee86-4f7e-b5af-a2bb917ddeef	a8877b593ed92eb2e8ba395b9cc2923ae4e84d1db1162b2db2d746a45cc7e666	2025-08-27 12:27:43.232003+00	20250814070412_ajout_relation_preventive_user	\N	\N	2025-08-27 12:27:43.220085+00	1
d1d6bbd1-6bef-456a-8e77-64a52dcd31dc	25dbcf85371e27424040acc59e6226706afda9eec6671feefe793998ae79299a	2025-08-11 07:50:07.236075+00	20250811075007_add_delete_cascade_preventive	\N	\N	2025-08-11 07:50:07.215721+00	1
2a36e692-4b02-4213-92d4-37797523e860	5fcfcdbfe3e35ffced4f89f2724c8239ab441a5e0c07e7ca85d1d6acfa660b26	2025-08-27 12:27:43.236885+00	20250814090858_add_validation_code	\N	\N	2025-08-27 12:27:43.232756+00	1
0e3386bc-12d6-4705-85aa-abd95208aa57	8bf2f29423f71d43ac9be34844145cf458e7a0743d1836182c4e8b15ce00e175	2025-08-12 06:57:57.525493+00	20250812065757_add_status_to_preventive	\N	\N	2025-08-12 06:57:57.513815+00	1
12bb80a6-c58c-4c8c-b70a-c95802bc99e6	a8877b593ed92eb2e8ba395b9cc2923ae4e84d1db1162b2db2d746a45cc7e666	2025-08-14 07:04:12.137515+00	20250814070412_ajout_relation_preventive_user	\N	\N	2025-08-14 07:04:12.116259+00	1
fc6cf274-43f7-4428-9539-09cdcbb31f19	5fcfcdbfe3e35ffced4f89f2724c8239ab441a5e0c07e7ca85d1d6acfa660b26	2025-08-14 09:08:58.683426+00	20250814090858_add_validation_code	\N	\N	2025-08-14 09:08:58.669539+00	1
\.


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Category_id_seq"', 79, true);


--
-- Name: Documentation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Documentation_id_seq"', 1, false);


--
-- Name: Intervention_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Intervention_id_seq"', 40, true);


--
-- Name: Localisation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Localisation_id_seq"', 7, true);


--
-- Name: MaterialIntervention_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."MaterialIntervention_id_seq"', 37, true);


--
-- Name: MaterialPreventive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."MaterialPreventive_id_seq"', 27, true);


--
-- Name: Material_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Material_id_seq"', 252, true);


--
-- Name: Movement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Movement_id_seq"', 50, true);


--
-- Name: Parent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Parent_id_seq"', 1, false);


--
-- Name: Preventive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Preventive_id_seq"', 27, true);


--
-- Name: Priority_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Priority_id_seq"', 3, true);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Role_id_seq"', 4, true);


--
-- Name: Service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Service_id_seq"', 2, true);


--
-- Name: StatusIntervention_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."StatusIntervention_id_seq"', 40, true);


--
-- Name: Status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Status_id_seq"', 4, true);


--
-- Name: Type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Type_id_seq"', 1, false);


--
-- Name: UserIntervention_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."UserIntervention_id_seq"', 23, true);


--
-- Name: UserPreventive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."UserPreventive_id_seq"', 6, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."User_id_seq"', 29, true);


--
-- PostgreSQL database dump complete
--

\unrestrict k5J6yRP2U5kagov2Spzz6s7cMCBdqFol7tMSsbxI8FdqxVQYy2A38B79QMPRyWq

