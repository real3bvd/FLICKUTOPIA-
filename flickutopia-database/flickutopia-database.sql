--
-- PostgreSQL database dump
--

\restrict i1lVQ2T9zLFl2JDPEkVO2R5cbP3qhSLIaeHH26KQcXsiwk3Z7bOoXTTxxHZTs63

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

-- Started on 2026-01-07 19:48:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 218 (class 1259 OID 16390)
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    id bigint NOT NULL,
    age_consent character varying(255),
    description character varying(1000),
    director character varying(255),
    duration character varying(255),
    genre character varying(255),
    in_banner boolean,
    poster_url character varying(255),
    release_date character varying(255),
    rent_price character varying(255),
    title character varying(255),
    trailer_id character varying(255),
    actors character varying(255)
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_id_seq OWNER TO postgres;

--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 217
-- Name: movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_id_seq OWNED BY public.movies.id;


--
-- TOC entry 220 (class 1259 OID 16402)
-- Name: user_library; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_library (
    id bigint NOT NULL,
    movie_id bigint,
    type character varying(255),
    user_id character varying(255)
);


ALTER TABLE public.user_library OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16401)
-- Name: user_library_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_library_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_library_id_seq OWNER TO postgres;

--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_library_id_seq OWNED BY public.user_library.id;


--
-- TOC entry 4700 (class 2604 OID 16393)
-- Name: movies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN id SET DEFAULT nextval('public.movies_id_seq'::regclass);


--
-- TOC entry 4701 (class 2604 OID 16405)
-- Name: user_library id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_library ALTER COLUMN id SET DEFAULT nextval('public.user_library_id_seq'::regclass);


--
-- TOC entry 4852 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (id, age_consent, description, director, duration, genre, in_banner, poster_url, release_date, rent_price, title, trailer_id, actors) FROM stdin;
119	18+	Two detectives hunt a serial killer who justifies his crimes using the seven deadly sins.	David Fincher	2h 7m	Thriller	t	\N	1995	34.92	Se7en	znmZoVkCjpI	Brad Pitt, Morgan Freeman, abdu
107	13+	A child psychologist tries to help a young boy who claims to see and communicate with the dead.	M. Night Shyamalan	1h 47m	Thriller	f	\N	1999	34.99	The Sixth Sense	VG9AGf66tXM	Bruce Willis, Haley Joel Osment, Toni Collette
110	7+	A curious girl discovers a secret door in her new home leading to an idealized parallel world.	fardawsa mustafa	1h 40m	Horror	f	\N	2009	34.99	Coraline	m9bOpeuvNwY	Dakota Fanning, Teri Hatcher, Keith David
113	13+	Batman faces his greatest challenge when the Joker unleashes chaos on Gotham.	Christopher Nolan	2h 32m	Action	f	\N	2008	44.99	The Dark Knight	EXeTwQWrcwY	Christian Bale, Heath Ledger, Aaron Eckhart
109	7+	A shy groom accidentally marries a mysterious woman from the land of the dead.	Tim Burton	1h 17m	Horror	f	\N	2005	29.99	Corpse Bride	gvxBRVntShY	Johnny Depp, Helena Bonham Carter, Emily Watson
111	7+	A clever fox promises his wife to stop stealing, but cannot resist one last heist.	Wes Anderson	1h 27m	Comedy	f	\N	2009	29.99	Fantastic Mr. Fox	n2igjYFojUo	George Clooney, Meryl Streep, Bill Murray
112	16+	A banker wrongly convicted of murder forms an unlikely friendship in prison.	Frank Darabont	2h 22m	Drama	f	\N	1994	34.99	The Shawshank Redemption	6hB3S9bIaco	Tim Robbins, Morgan Freeman, Bob Gunton
114	18+	The lives of two hitmen, a boxer, and a gangsters wife intertwine in four tales.	Quentin Tarantino	2h 34m	Drama	f	\N	1994	39.99	Pulp Fiction	s7EdQ4FqbhY	John Travolta, Samuel L. Jackson, Uma Thurman
115	13+	A simple man with a kind heart unwittingly influences several major historical events.	Robert Zemeckis	2h 22m	Drama	f	\N	1994	34.99	Forrest Gump	bLvqoHBptjg	Tom Hanks, Robin Wright, Gary Sinise
117	16+	A computer hacker discovers that reality is a simulation created by machines to enslave humanity.	Wachowski Sisters	2h 16m	Sci-Fi	f	\N	1999	39.99	The Matrix	vKQi3bBA1y8	Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss
118	16+	A Roman general is betrayed and reduced to slavery, rising through gladiator ranks for vengeance.	Ridley Scott	2h 35m	Action	f	\N	2000	39.99	Gladiator	owK1qxDselE	Russell Crowe, Joaquin Phoenix, Connie Nielsen
105	18+	An insomniac office worker and a soap salesman form an underground fight club that evolves into something far more dangerous.	David Fincher	2h 19m	Drama	f	\N	1999	39.99	Fight Club	SUXWAEX2jlg	Brad Pitt, Edward Norton, Helena Bonham Carter
106	13+	A former NASA pilot ventures through a wormhole to find a new home for humanity as Earth faces extinction.	Christopher Nolan	2h 41m	Sci-Fi	t	\N	2014	44.99	Interstellar	zSWdZVtXT7E	Matthew McConaughey, Anne Hathaway, Jessica Chastain
116	13+	A skilled thief who steals secrets from dreams must perform the impossible task of planting an idea.	Christopher Nolan	2h 28m	Sci-Fi	t	\N	2010	44.99	Inception	YoHD9XEInc0	Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page
108	16+	A poor family infiltrates a wealthy household by posing as unrelated, highly qualified workers.	Bong Joon-ho	2h 12m	Drama	t	\N	2019	44.99	Parasite	5xH0HfJHsaY	Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong
120	18+	An FBI trainee seeks help from an imprisoned cannibal to catch another serial killer.	Jonathan Demme	1h 58m	Thriller	f	\N	1991	34.99	The Silence of the Lambs	W6Mm8Sbe__o	Jodie Foster, Anthony Hopkins, Scott Glenn
121	16+	A young jazz drummer faces an instructor who will stop at nothing to realize his potential.	Damien Chazelle	1h 46m	Drama	f	\N	2014	39.99	Whiplash	7d_jQycdQGo	Miles Teller, J.K. Simmons, Paul Reiser
122	16+	Death Row guards discover one of their inmates possesses a mysterious supernatural gift.	Frank Darabont	3h 9m	Drama	f	\N	1999	34.99	The Green Mile	Ki4haFrqSrw	Tom Hanks, Michael Clarke Duncan, David Morse
123	18+	A failed comedian descends into madness and transforms into a criminal mastermind.	Todd Phillips	2h 2m	Drama	f	\N	2019	44.99	Joker	zAGVQLHvwOY	Joaquin Phoenix, Robert De Niro, Zazie Beetz
124	13+	Earths mightiest heroes unite to stop Thanos from collecting all six Infinity Stones.	Russo Brothers	2h 29m	Action	f	\N	2018	44.99	Avengers: Infinity War	6ZfuNTqbHE8	Robert Downey Jr., Chris Hemsworth, Josh Brolin
125	16+	Following D-Day, a squad embarks on a mission to find a paratrooper whose brothers died.	Steven Spielberg	2h 49m	Action	f	\N	1998	34.99	Saving Private Ryan	RYID71hYHzg	Tom Hanks, Matt Damon, Tom Sizemore
126	18+	An undercover cop and a mole race to identify each other while infiltrating the Irish mafia.	Martin Scorsese	2h 31m	Thriller	f	\N	2006	39.99	The Departed	iQpb1LoeVUc	Leonardo DiCaprio, Matt Damon, Jack Nicholson
127	13+	A society woman falls for a penniless artist aboard the ill-fated R.M.S. Titanic.	James Cameron	3h 14m	Romance	f	\N	1997	34.99	Titanic	2e-eXJ6HgkQ	Leonardo DiCaprio, Kate Winslet, Billy Zane
128	13+	Two rival magicians engage in an escalating battle to create the ultimate illusion.	Christopher Nolan	2h 10m	Thriller	f	\N	2006	39.99	The Prestige	o4gHCmTQDVI	Hugh Jackman, Christian Bale, Scarlett Johansson
129	18+	A freed slave teams up with a bounty hunter to rescue his wife from a plantation owner.	Quentin Tarantino	2h 45m	Drama	f	\N	2012	39.99	Django Unchained	0fUCuvNlOCg	Jamie Foxx, Christoph Waltz, Leonardo DiCaprio
130	18+	A stockbroker rises to wealth through corruption and fraud on Wall Street.	Martin Scorsese	3h	Comedy	f	\N	2013	39.99	The Wolf of Wall Street	iszwuX1AK6A	Leonardo DiCaprio, Jonah Hill, Margot Robbie
131	16+	Two Marshals investigate a disappearance from a remote asylum for the criminally insane.	Martin Scorsese	2h 18m	Thriller	f	\N	2010	39.99	Shutter Island	5iaYLCiq5RM	Leonardo DiCaprio, Mark Ruffalo, Ben Kingsley
132	16+	A blade runner uncovers a secret that could plunge civilization into chaos.	Denis Villeneuve	2h 44m	Sci-Fi	f	\N	2017	44.99	Blade Runner 2049	gCcx85zbxz4	Ryan Gosling, Harrison Ford, Ana de Armas
133	16+	A spacecraft crew encounters a deadly life form after investigating a mysterious signal.	Ridley Scott	1h 57m	Horror	f	\N	1979	29.99	Alien	LjLamj-b0I8	Sigourney Weaver, Tom Skerritt, John Hurt
134	7+	A teenager is sent back to 1955 in a time-traveling DeLorean.	Robert Zemeckis	1h 56m	Adventure	f	\N	1985	29.99	Back to the Future	qvsgGtivCgs	Michael J. Fox, Christopher Lloyd, Lea Thompson
135	16+	The patriarch of a crime dynasty transfers control to his reluctant youngest son.	Francis Ford Coppola	2h 55m	Drama	f	\N	1972	34.99	The Godfather	sY1S34973zA	Marlon Brando, Al Pacino, James Caan
136	13+	The final battle for Middle-earth begins as Frodo and Sam approach Mount Doom.	Peter Jackson	3h 21m	Adventure	f	\N	2003	44.99	The Lord of the Rings	r5X-hFf6Bwo	Elijah Wood, Viggo Mortensen, Ian McKellen
137	16+	A businessman saves over a thousand Jewish refugees during the Holocaust.	Steven Spielberg	3h 15m	History	f	\N	1993	34.99	Schindlers List	mxphAlJID9U	Liam Neeson, Ralph Fiennes, Ben Kingsley
138	16+	Michael Corleone expands his empire while flashbacks reveal his fathers rise.	Francis Ford Coppola	3h 22m	Drama	f	\N	1974	34.99	The Godfather Part II	9O1Iy9od7-A	Al Pacino, Robert De Niro, Robert Duvall
139	13+	A jury must decide the fate of a young man accused of murder.	Sidney Lumet	1h 36m	Drama	f	\N	1957	29.99	12 Angry Men	A7CBKT0PWFA	Henry Fonda, Lee J. Cobb, Martin Balsam
140	16+	A criminal fakes insanity to serve time in a mental institution.	Milos Forman	2h 13m	Drama	f	\N	1975	29.99	One Flew Over the Cuckoos Nest	2WSyJgydTsA	Jack Nicholson, Louise Fletcher, Will Sampson
141	18+	A young man grows up in the mob and works his way through the ranks.	Martin Scorsese	2h 26m	Drama	f	\N	1990	34.99	Goodfellas	2ilzidi_J8Q	Robert De Niro, Ray Liotta, Joe Pesci
142	18+	A sole survivor recounts the events leading up to a horrific crime.	Bryan Singer	1h 46m	Thriller	f	\N	1995	34.99	The Usual Suspects	x3Kq3jXA8r4	Kevin Spacey, Gabriel Byrne, Benicio del Toro
143	18+	A hitman takes in a young girl after her family is murdered.	Luc Besson	1h 50m	Action	f	\N	1994	34.99	Leon: The Professional	DcsirofJrlM	Jean Reno, Gary Oldman, Natalie Portman
144	18+	A former neo-Nazi tries to prevent his brother from following the same path.	Tony Kaye	1h 59m	Drama	f	\N	1998	34.99	American History X	XfQYHqsiN5g	Edward Norton, Edward Furlong, Beverly DAngelo
145	18+	Two boys in a Rio slum take different paths: photographer and drug dealer.	Fernando Meirelles	2h 10m	Drama	f	\N	2002	34.99	City of God	dcUOO4Itgmw	Alexandre Rodrigues, Leandro Firmino, Matheus Nachtergaele
146	16+	A Jewish musician struggles to survive the Warsaw ghetto during WWII.	Roman Polanski	2h 30m	History	f	\N	2002	34.99	The Pianist	u_jE7-eCI7Q	Adrien Brody, Thomas Kretschmann, Frank Finlay
147	16+	A man with memory loss uses notes and tattoos to hunt his wifes murderer.	Christopher Nolan	1h 53m	Thriller	f	\N	2000	34.99	Memento	0vS0E9bBSL0	Guy Pearce, Carrie-Anne Moss, Joe Pantoliano
148	13+	A quadriplegic hires a young man from the projects as his caretaker.	Olivier Nakache	1h 52m	Comedy	f	\N	2011	34.99	The Intouchables	34WIbmXkewU	Francois Cluzet, Omar Sy, Anne Le Ny
149	7+	A girl becomes trapped in a spirit world ruled by witches and spirits.	Hayao Miyazaki	2h 5m	Adventure	f	\N	2001	39.99	Spirited Away	ByXuk9QqQkk	Rumi Hiiragi, Miyu Irino, Mari Natsuki
150	13+	A nightclub owner must choose between love and virtue in wartime Morocco.	Michael Curtiz	1h 42m	Romance	f	\N	1942	29.99	Casablanca	BkL9l7qovsE	Humphrey Bogart, Ingrid Bergman, Paul Henreid
151	7+	The Tramp struggles to survive in modern industrialized society.	Charlie Chaplin	1h 27m	Comedy	f	\N	1936	24.99	Modern Times	GLeDdzGUTq0	Charlie Chaplin, Paulette Goddard, Henry Bergman
152	13+	A photographer with a broken leg becomes convinced he witnessed a murder.	Alfred Hitchcock	1h 52m	Thriller	f	\N	1954	29.99	Rear Window	mT4a3vPFD5g	James Stewart, Grace Kelly, Wendell Corey
153	7+	A lion prince must return to take his rightful place and confront his uncle.	Roger Allers	1h 28m	Adventure	f	\N	1994	29.99	The Lion King	4sj1MT05lAA	Matthew Broderick, Jeremy Irons, James Earl Jones
154	18+	A captain is sent into Cambodia to assassinate a renegade colonel.	Francis Ford Coppola	2h 27m	Drama	f	\N	1979	29.99	Apocalypse Now	FTjG-c2n3c4	Martin Sheen, Marlon Brando, Robert Duvall
155	16+	Ripley returns to the alien planet with colonial marines.	James Cameron	2h 17m	Action	f	\N	1986	29.99	Aliens	oSeQQlaCZgU	Sigourney Weaver, Michael Biehn, Carrie Henn
156	16+	A Stasi agent becomes obsessed with a playwright and his lover.	Florian Henckel von Donnersmarck	2h 17m	Drama	f	\N	2006	34.99	The Lives of Others	n3_iLOp6IhM	Ulrich Muhe, Martina Gedeck, Sebastian Koch
157	13+	A boy and his sister struggle to survive in WWII Japan.	Isao Takahata	1h 29m	Drama	f	\N	1988	29.99	Grave of the Fireflies	4vPeTSRd580	Tsutomu Tatsumi, Ayano Shiraishi, Akemi Yamaguchi
158	13+	An officer defends soldiers on trial for cowardice during WWI.	Stanley Kubrick	1h 28m	Drama	f	\N	1957	29.99	Paths of Glory	nmDA02AjuhE	Kirk Douglas, Ralph Meeker, Adolphe Menjou
159	7+	A lonely robot discovers a new purpose when a sleek probe arrives.	Andrew Stanton	1h 38m	Adventure	f	\N	2008	29.99	WALL-E	alIq_wG9FNk	Ben Burtt, Elissa Knight, Jeff Garlin
160	18+	An evil presence in an isolated hotel slowly drives a father insane.	Stanley Kubrick	2h 26m	Horror	f	\N	1980	34.99	The Shining	5Cb3ik6zP2I	Jack Nicholson, Shelley Duvall, Danny Lloyd
161	16+	A secretary checks into a remote motel run by a disturbed man.	Alfred Hitchcock	1h 49m	Horror	f	\N	1960	29.99	Psycho	Wz719b9QUqY	Anthony Perkins, Janet Leigh, Vera Miles
162	16+	A Terminator protects the future leader of humanity from an assassin.	James Cameron	2h 17m	Action	f	\N	1991	34.99	Terminator 2: Judgment Day	CRRlbK5w8AE	Arnold Schwarzenegger, Linda Hamilton, Edward Furlong
163	13+	A screenwriter becomes entangled with a faded silent film star.	Billy Wilder	1h 50m	Drama	f	\N	1950	24.99	Sunset Boulevard	ooXpSrBGpzU	William Holden, Gloria Swanson, Erich von Stroheim
164	13+	The President scrambles to prevent nuclear armageddon.	Stanley Kubrick	1h 35m	Comedy	f	\N	1964	29.99	Dr. Strangelove	1gXY3kuDvSU	Peter Sellers, George C. Scott, Sterling Hayden
165	18+	A man imprisoned for 15 years hunts for answers after release.	Park Chan-wook	2h	Thriller	f	\N	2003	34.99	Oldboy	2HkjrJ6IK5E	Choi Min-sik, Yoo Ji-tae, Kang Hye-jung
166	7+	A barber is mistaken for a ruthless dictator.	Charlie Chaplin	2h 5m	Comedy	f	\N	1940	24.99	The Great Dictator	doRE3aF1L2k	Charlie Chaplin, Paulette Goddard, Jack Oakie
167	13+	A filmmaker recalls his friendship with a cinema projectionist.	Giuseppe Tornatore	2h 35m	Drama	f	\N	1988	29.99	Cinema Paradiso	hIacbbpBmXs	Philippe Noiret, Enzo Cannavale, Antonella Attili
168	16+	A ronin requests permission for ritual suicide with a hidden purpose.	Masaki Kobayashi	2h 13m	Drama	f	\N	1962	29.99	Harakiri	4cDvWjNwjRQ	Tatsuya Nakadai, Akira Ishihama, Shima Iwashita
169	16+	A stranger joins a bandit to protect a widow from an assassin.	Sergio Leone	2h 45m	Adventure	f	\N	1968	29.99	Once Upon a Time in the West	MNGQ1hUyx-k	Henry Fonda, Charles Bronson, Claudia Cardinale
170	7+	A cowboy doll feels threatened when a spaceman becomes the favorite.	John Lasseter	1h 21m	Comedy	f	\N	1995	29.99	Toy Story	v-PjgYDrg70	Tom Hanks, Tim Allen, Don Rickles
171	7+	Two teenagers mysteriously swap bodies across time and space.	Makoto Shinkai	1h 46m	Romance	f	\N	2016	39.99	Your Name	xU47nhruN-Q	Ryunosuke Kamiki, Mone Kamishiraishi, Ryo Narita
172	18+	A father has a midlife crisis after becoming infatuated with a friend.	Sam Mendes	2h 2m	Drama	f	\N	1999	34.99	American Beauty	Ly7rq34F_0I	Kevin Spacey, Annette Bening, Thora Birch
173	16+	William Wallace leads Scotland in rebellion against English rule.	Mel Gibson	2h 58m	Action	f	\N	1995	34.99	Braveheart	1NJO0jxBtMo	Mel Gibson, Sophie Marceau, Patrick McGoohan
174	18+	After a heist goes wrong, criminals suspect one is an informant.	Quentin Tarantino	1h 39m	Thriller	f	\N	1992	34.99	Reservoir Dogs	vayksn4Y93A	Harvey Keitel, Tim Roth, Michael Madsen
175	16+	A janitor at MIT proves to be a mathematical genius.	Gus Van Sant	2h 6m	Drama	f	\N	1997	34.99	Good Will Hunting	PaZVjZEFkRs	Robin Williams, Matt Damon, Ben Affleck
176	18+	Four people spiral into addiction chasing their American dreams.	Darren Aronofsky	1h 42m	Drama	f	\N	2000	34.99	Requiem for a Dream	lgo3Hb5vWLE	Ellen Burstyn, Jared Leto, Jennifer Connelly
177	13+	A voyage to Jupiter with HAL turns deadly.	Stanley Kubrick	2h 29m	Sci-Fi	f	\N	1968	29.99	2001: A Space Odyssey	oR_e9y-bka0	Keir Dullea, Gary Lockwood, William Sylvester
178	13+	A detective with a fear of heights follows a mysterious woman.	Alfred Hitchcock	2h 8m	Thriller	f	\N	1958	29.99	Vertigo	Z5jMwBFGkFU	James Stewart, Kim Novak, Barbara Bel Geddes
179	16+	A city hunts for a child murderer.	Fritz Lang	1h 57m	Thriller	f	\N	1931	24.99	M	IfG03Sl9dP0	Peter Lorre, Ellen Widmann, Inge Landgut
180	16+	A WWII German submarine crew faces harrowing missions.	Wolfgang Petersen	2h 29m	Drama	f	\N	1981	29.99	Das Boot	i_fg2KPHB7E	Jurgen Prochnow, Herbert Gronemeyer, Klaus Wennemann
181	7+	The toys must escape a daycare before their owner leaves for college.	Lee Unkrich	1h 43m	Comedy	f	\N	2010	29.99	Toy Story 3	JcpWXaA2qeg	Tom Hanks, Tim Allen, Joan Cusack
182	18+	A teachers life is destroyed when wrongly accused of child abuse.	Thomas Vinterberg	1h 55m	Drama	f	\N	2012	34.99	The Hunt	iYKFbp_1puQ	Mads Mikkelsen, Thomas Bo Larsen, Annika Wedderkopp
183	18+	Boxing promoters, gangsters, and a diamond collide in London.	Guy Ritchie	1h 44m	Comedy	f	\N	2000	34.99	Snatch	ni4tEtuTccc	Jason Statham, Brad Pitt, Benicio del Toro
184	16+	A couple erases each other from their memories after a breakup.	Michel Gondry	1h 48m	Romance	f	\N	2004	34.99	Eternal Sunshine of the Spotless Mind	07-QBnEkgXU	Jim Carrey, Kate Winslet, Kirsten Dunst
185	18+	Jewish-American soldiers spread fear through Nazi-occupied France.	Quentin Tarantino	2h 33m	Drama	f	\N	2009	39.99	Inglourious Basterds	KnrRy6kSFF0	Brad Pitt, Christoph Waltz, Melanie Laurent
186	18+	A Marine follows his squad from boot camp through Vietnam.	Stanley Kubrick	1h 56m	Drama	f	\N	1987	29.99	Full Metal Jacket	n2i917l5RFc	Matthew Modine, Adam Baldwin, Vincent DOnofrio
187	13+	A bouncer becomes a drivers for a pianist touring the Deep South.	Peter Farrelly	2h 10m	Drama	f	\N	2018	39.99	Green Book	QkZxoko_HC0	Viggo Mortensen, Mahershala Ali, Linda Cardellini
\.


--
-- TOC entry 4854 (class 0 OID 16402)
-- Dependencies: 220
-- Data for Name: user_library; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_library (id, movie_id, type, user_id) FROM stdin;
14	113	WATCHLIST	ReMDxZYaYsfPjSuO49Icnkl5X722
15	112	WATCHLIST	ReMDxZYaYsfPjSuO49Icnkl5X722
16	107	RENTED	8TPCEHZPQkShB3pmKe13D3lH3U43
17	119	RENTED	8TPCEHZPQkShB3pmKe13D3lH3U43
\.


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 217
-- Name: movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_id_seq', 188, true);


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_library_id_seq', 17, true);


--
-- TOC entry 4703 (class 2606 OID 16397)
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- TOC entry 4705 (class 2606 OID 16409)
-- Name: user_library user_library_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_library
    ADD CONSTRAINT user_library_pkey PRIMARY KEY (id);


-- Completed on 2026-01-07 19:48:05

--
-- PostgreSQL database dump complete
--

\unrestrict i1lVQ2T9zLFl2JDPEkVO2R5cbP3qhSLIaeHH26KQcXsiwk3Z7bOoXTTxxHZTs63

