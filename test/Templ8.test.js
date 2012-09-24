typeof m8     !== 'undefined' || ( m8     = require( 'm8'     ) );
typeof Templ8 !== 'undefined' || ( Templ8 = require( '../Templ8' ) );
typeof chai   !== 'undefined' || ( chai   = require( 'chai'   ) );

m8.ENV != 'commonjs' || require( '../Templ8.Filter.html' );

expect  = chai.expect;

suite( 'Templ8', function() {

	var data = {
		title              : 'Test data',
		displayTitle       : false,
		columns            : {
			name           : { width :  6 },
			email          : { width : 21 },
			city           : { width : 22 },
			country        : { width : 23 },
			date           : { width : 24 }
		},
		items_empty_array  : [],
		items_empty_object : {},
		items_nonexistent  : null,
		items_small        : [
			{ name : 'Baxter', email : 'at.pretium@ultricies.com',   city : 'North Platte', country : 'Guatemala',   date : '13/01/2009' },
			{ name : 'Alyssa', email : 'arcu@purusgravida.org',      city : 'Pawtucket',    country : 'Somalia',     date : '22/10/2007' },
			{ name : 'Fleur',  email : 'vehicula@temporarcu.org',    city : 'Hidden Hills', country : 'Myanmar',     date : '06/10/2008' },
			{ name : 'Norman', email : 'Vivamus@semmollis.org',      city : 'Ashland',      country : 'Timor-leste', date : '21/07/2009' },
			{ name : 'Bryar',  email : 'Nulla.tempor@adipiscing.ca', city : 'Helena',       country : 'Aruba',       date : '26/03/2009' }
		],
		items              : [
			{ name : 'Baxter', email : 'at.pretium@ultricies.com', city : 'North Platte', country : 'Guatemala', date : '13/01/2009' },
			{ name : 'Alyssa', email : 'arcu@purusgravida.org', city : 'Pawtucket', country : 'Somalia', date : '22/10/2007' },
			{ name : 'Fleur',  email : 'vehicula@temporarcu.org', city : 'Hidden Hills', country : 'Myanmar', date : '06/10/2008' },
			{ name : 'Norman', email : 'Vivamus@semmollis.org', city : 'Ashland', country : 'Timor-leste', date : '21/07/2009' },
			{ name : 'Bryar', email : 'Nulla.tempor@adipiscing.ca', city : 'Helena', country : 'Aruba', date : '26/03/2009' },
			{ name : 'Teegan', email : 'diam.vel.arcu@magnis.edu', city : 'Tampa', country : 'Svalbard and Jan Mayen', date : '17/07/2008' },
			{ name : 'Dorothy', email : 'luctus.felis@eteuismodet.ca', city : 'Keene', country : 'Namibia', date : '08/05/2008' },
			{ name : 'Aphrodite', email : 'Integer@vellectusCum.edu', city : 'Rancho Palos Verdes', country : 'Solomon Islands', date : '22/11/2007' },
			{ name : 'Quinn', email : 'varius.ultrices.mauris@diamProindolor.edu', city : 'Shamokin', country : 'Norway', date : '07/03/2009' },
			{ name : 'Bree', email : 'Vestibulum@nequeNullam.org', city : 'Laramie', country : 'Norway', date : '05/08/2007' },
			{ name : 'Zahir', email : 'ultrices.sit.amet@nullamagnamalesuada.ca', city : 'Lawton', country : 'Tuvalu', date : '15/01/2009' },
			{ name : 'Basil', email : 'ligula.Donec@atortorNunc.org', city : 'Monrovia', country : 'Kenya', date : '21/07/2008' },
			{ name : 'Inez', email : 'Curae;.Phasellus@non.edu', city : 'St. George', country : 'Reunion', date : '08/12/2007' },
			{ name : 'Fletcher', email : 'diam.lorem@malesuadautsem.ca', city : 'Hayward', country : 'Central African Republic', date : '02/05/2008' },
			{ name : 'Sage', email : 'libero.mauris.aliquam@elementumloremut.org', city : 'Nenana', country : 'Ukraine', date : '11/09/2007' },
			{ name : 'Brandon', email : 'Vivamus.rhoncus@etrisusQuisque.com', city : 'Eden Prairie', country : 'Georgia', date : '16/12/2008' },
			{ name : 'Miriam', email : 'Cum.sociis@sed.com', city : 'Alpharetta', country : 'Tanzania, United Republic of', date : '13/02/2009' },
			{ name : 'Whoopi', email : 'et.magna@faucibus.ca', city : 'Frederiksted', country : 'Australia', date : '11/03/2009' },
			{ name : 'Shay', email : 'metus.vitae@Vestibulumaccumsanneque.com', city : 'New Haven', country : 'Anguilla', date : '09/04/2008' },
			{ name : 'Orson', email : 'a@cursusin.edu', city : 'Webster Groves', country : 'El Salvador', date : '13/12/2007' },
			{ name : 'Laurel', email : 'nunc.sed@iaculis.org', city : 'Agawam', country : 'Sierra Leone', date : '10/07/2009' },
			{ name : 'Walter', email : 'Maecenas.mi@dictum.edu', city : 'Des Moines', country : 'Iceland', date : '18/04/2009' },
			{ name : 'Lyle', email : 'Quisque.nonummy.ipsum@natoquepenatibus.org', city : 'Meridian', country : 'Azerbaijan', date : '28/01/2008' },
			{ name : 'Alan', email : 'Nunc.commodo@enimnec.org', city : 'Stevens Point', country : 'Aruba', date : '07/09/2008' },
			{ name : 'Bernard', email : 'dictum.cursus@tellusimperdietnon.edu', city : 'Radford', country : 'Uganda', date : '19/09/2008' },
			{ name : 'Rae', email : 'ut.erat@massa.com', city : 'Rawlins', country : 'Madagascar', date : '14/04/2008' },
			{ name : 'Evangeline', email : 'sed.orci.lobortis@anteiaculis.org', city : 'Phoenix', country : 'Mauritius', date : '28/04/2008' },
			{ name : 'Zachary', email : 'Mauris.blandit@sollicitudina.edu', city : 'Logan', country : 'Bouvet Island', date : '18/12/2008' },
			{ name : 'Ivana', email : 'vitae.orci.Phasellus@ultricesDuis.ca', city : 'Greensburg', country : 'Niger', date : '18/07/2008' },
			{ name : 'Jada', email : 'aliquet.nec@mollisdui.org', city : 'Texas City', country : 'Bermuda', date : '09/04/2009' },
			{ name : 'Kiara', email : 'Donec.vitae.erat@Sed.com', city : 'Oak Ridge', country : 'Malawi', date : '06/08/2007' },
			{ name : 'Roth', email : 'vestibulum.nec.euismod@tristiquesenectuset.com', city : 'West Lafayette', country : 'Finland', date : '16/11/2007' },
			{ name : 'Cathleen', email : 'at@erat.edu', city : 'Pass Christian', country : 'Egypt', date : '31/12/2008' },
			{ name : 'Kendall', email : 'eget.tincidunt@nulla.org', city : 'Jersey City', country : 'Turks and Caicos Islands', date : '31/10/2007' },
			{ name : 'Ishmael', email : 'Curabitur@suscipitestac.org', city : 'Loudon', country : 'Iran, Islamic Republic of', date : '30/04/2008' },
			{ name : 'Jeanette', email : 'placerat.augue@nec.edu', city : 'New Castle', country : 'Cameroon', date : '27/07/2007' },
			{ name : 'Cruz', email : 'sit.amet@Integer.ca', city : 'Fallon', country : 'Uzbekistan', date : '20/10/2007' },
			{ name : 'Kermit', email : 'sapien.molestie.orci@Integerinmagna.org', city : 'Sierra Madre', country : 'Syrian Arab Republic', date : '18/06/2008' },
			{ name : 'Sybill', email : 'et.netus.et@semperdui.com', city : 'Tonawanda', country : 'Venezuela', date : '31/12/2007' },
			{ name : 'Shellie', email : 'non@lobortisquama.ca', city : 'Yigo', country : 'Monaco', date : '30/05/2008' },
			{ name : 'Dane', email : 'non@turpisegestas.ca', city : 'Needham', country : 'Nauru', date : '01/02/2008' },
			{ name : 'Roanna', email : 'nisl.Quisque.fringilla@nulla.com', city : 'Birmingham', country : 'Lesotho', date : '14/11/2008' },
			{ name : 'Christopher', email : 'Proin.mi.Aliquam@arcuMorbisit.ca', city : 'Olympia', country : 'Cameroon', date : '18/07/2009' },
			{ name : 'Adrienne', email : 'Aliquam.auctor.velit@lacuspede.ca', city : 'West Hollywood', country : 'Bangladesh', date : '18/08/2008' },
			{ name : 'Catherine', email : 'et.ultrices@sed.com', city : 'Springfield', country : 'Ethiopia', date : '19/10/2008' },
			{ name : 'Dale', email : 'dolor.Fusce@scelerisquescelerisquedui.org', city : 'Gary', country : 'United Kingdom', date : '13/12/2007' },
			{ name : 'Keith', email : 'consectetuer@sagittisDuisgravida.com', city : 'Worland', country : 'Central African Republic', date : '21/11/2008' },
			{ name : 'Dahlia', email : 'dapibus.rutrum.justo@arcu.com', city : 'Cedar Rapids', country : 'Bulgaria', date : '29/11/2007' },
			{ name : 'Arsenio', email : 'Nulla.dignissim.Maecenas@facilisiSed.edu', city : 'Saratoga Springs', country : 'Jordan', date : '04/10/2007' },
			{ name : 'Lynn', email : 'Mauris@sempererat.org', city : 'Fitchburg', country : 'Jamaica', date : '17/07/2008' },
			{ name : 'Todd', email : 'ut.quam.vel@Sed.com', city : 'Duncan', country : 'Jordan', date : '11/08/2008' },
			{ name : 'Danielle', email : 'nisi.Cum.sociis@Aliquam.org', city : 'Gloversville', country : 'Guam', date : '26/08/2008' },
			{ name : 'Kendall', email : 'varius.et.euismod@diamnuncullamcorper.org', city : 'Corpus Christi', country : 'Mexico', date : '26/06/2009' },
			{ name : 'Aileen', email : 'nunc.ac@Nuncuterat.edu', city : 'Gulfport', country : 'American Samoa', date : '09/04/2008' },
			{ name : 'Cairo', email : 'interdum.enim@mollislectus.com', city : 'Santa Monica', country : 'Brazil', date : '06/06/2009' },
			{ name : 'Brenna', email : 'dis@dolorsit.org', city : 'Roswell', country : 'Madagascar', date : '10/11/2008' },
			{ name : 'Hayes', email : 'risus.Donec@diamSed.com', city : 'Union City', country : 'Haiti', date : '06/04/2009' },
			{ name : 'Wyoming', email : 'amet.massa.Quisque@libero.org', city : 'Berlin', country : 'Comoros', date : '03/08/2007' },
			{ name : 'Elizabeth', email : 'ipsum@purus.com', city : 'Fort Dodge', country : 'Netherlands', date : '22/02/2009' },
			{ name : 'Nell', email : 'pede.ac@sitametmassa.ca', city : 'Culver City', country : 'Paraguay', date : '06/01/2008' },
			{ name : 'Jakeem', email : 'Nulla.eget@Sedetlibero.ca', city : 'Corvallis', country : 'Ukraine', date : '16/09/2008' },
			{ name : 'Ramona', email : 'accumsan.interdum@Maurisblanditenim.edu', city : 'Asbury Park', country : 'Kenya', date : '21/08/2007' },
			{ name : 'David', email : 'dolor.dolor@miAliquamgravida.ca', city : 'Hammond', country : 'Oman', date : '06/10/2008' },
			{ name : 'Lane', email : 'rutrum.lorem@Nullatemporaugue.org', city : 'Milford', country : 'Niue', date : '04/12/2008' },
			{ name : 'Amy', email : 'nec.tempus@justo.org', city : 'Waycross', country : 'Germany', date : '09/11/2008' },
			{ name : 'Chaim', email : 'gravida.Praesent.eu@massarutrum.edu', city : 'Sanford', country : 'Eritrea', date : '03/07/2008' },
			{ name : 'Reese', email : 'Quisque.purus@ligulaAliquamerat.com', city : 'Jeffersontown', country : 'Uruguay', date : '15/03/2009' },
			{ name : 'Rae', email : 'egestas.Sed.pharetra@Nullamvelitdui.com', city : 'New Haven', country : 'Honduras', date : '28/08/2007' },
			{ name : 'Zelda', email : 'massa@diamProin.com', city : 'Stanton', country : 'United Kingdom', date : '15/02/2008' },
			{ name : 'Erich', email : 'mauris@Mauris.edu', city : 'Myrtle Beach', country : 'Algeria', date : '13/02/2008' },
			{ name : 'Katelyn', email : 'Donec.luctus@nislelementumpurus.edu', city : 'South Gate', country : 'Sao Tome and Principe', date : '19/04/2008' },
			{ name : 'Yoshi', email : 'pede.blandit.congue@quis.com', city : 'Port St. Lucie', country : 'Aruba', date : '04/04/2008' },
			{ name : 'Irma', email : 'hendrerit@hendrerit.com', city : 'Carrollton', country : 'Seychelles', date : '04/05/2008' },
			{ name : 'Jasper', email : 'Sed.eu@miloremvehicula.org', city : 'Pico Rivera', country : 'Angola', date : '25/09/2007' },
			{ name : 'Fritz', email : 'nunc.ac@magna.ca', city : 'Boulder Junction', country : 'Niue', date : '07/09/2008' },
			{ name : 'Isabelle', email : 'vitae.aliquet.nec@Nullatempor.org', city : 'Mesa', country : 'New Zealand', date : '10/08/2008' },
			{ name : 'Rudyard', email : 'eu@cursus.ca', city : 'Bossier City', country : 'Austria', date : '27/07/2008' },
			{ name : 'Hayfa', email : 'ac@justonecante.com', city : 'Valencia', country : 'Equatorial Guinea', date : '17/04/2009' },
			{ name : 'Todd', email : 'imperdiet.dictum.magna@Duiscursus.org', city : 'Dothan', country : 'Austria', date : '23/12/2007' },
			{ name : 'Keiko', email : 'cursus@vulputatenisisem.edu', city : 'Greenville', country : 'Qatar', date : '30/06/2008' },
			{ name : 'Denise', email : 'tincidunt@vitaepurusgravida.edu', city : 'Trenton', country : 'Marshall Islands', date : '20/08/2008' },
			{ name : 'Gannon', email : 'tempor.bibendum@Aliquam.com', city : 'Marshall', country : 'Zambia', date : '11/11/2008' },
			{ name : 'Claudia', email : 'pretium@acmieleifend.ca', city : 'Tallahassee', country : 'Guadeloupe', date : '01/08/2008' },
			{ name : 'Alexa', email : 'a.odio@malesuadaIntegerid.com', city : 'Odessa', country : 'Somalia', date : '01/09/2008' },
			{ name : 'Macey', email : 'ante.blandit.viverra@ultriciesornareelit.org', city : 'Gardner', country : 'Burundi', date : '25/06/2008' },
			{ name : 'Clark', email : 'libero.Integer.in@sagittis.ca', city : 'Evansville', country : 'Gibraltar', date : '07/11/2007' },
			{ name : 'Ava', email : 'quis.turpis.vitae@ametultriciessem.edu', city : 'Eatontown', country : 'Peru', date : '30/05/2009' },
			{ name : 'Jermaine', email : 'Phasellus@nunc.com', city : 'Springfield', country : 'Heard Island and Mcdonald Islands', date : '02/09/2007' },
			{ name : 'Wing', email : 'Duis.gravida@cursusIntegermollis.com', city : 'Union City', country : 'Falkland Islands (Malvinas)', date : '15/06/2009' },
			{ name : 'Demetria', email : 'Vestibulum@maurisMorbi.ca', city : 'Princeton', country : 'Guatemala', date : '11/01/2009' },
			{ name : 'Nigel', email : 'per.inceptos.hymenaeos@atrisus.org', city : 'Bellflower', country : 'Hong Kong', date : '13/04/2008' },
			{ name : 'Shelly', email : 'neque.sed.dictum@necimperdiet.com', city : 'Ada', country : 'United Arab Emirates', date : '03/06/2009' },
			{ name : 'Rhonda', email : 'in@nasceturridiculusmus.org', city : 'Chicago Heights', country : 'Tunisia', date : '09/05/2008' },
			{ name : 'Vivian', email : 'nisl.arcu.iaculis@elit.edu', city : 'Morgan City', country : 'Falkland Islands (Malvinas)', date : '04/04/2008' },
			{ name : 'Tatum', email : 'pede.nec.ante@dapibusligulaAliquam.org', city : 'Culver City', country : 'Czech Republic', date : '22/04/2008' },
			{ name : 'Indira', email : 'malesuada.fames@lectusante.ca', city : 'Grafton', country : 'Reunion', date : '06/12/2007' },
			{ name : 'Aiko', email : 'amet@venenatislacus.ca', city : 'Mobile', country : 'Morocco', date : '04/05/2008' },
			{ name : 'Josiah', email : 'sem.Pellentesque.ut@lorem.com', city : 'Guayanilla', country : 'Serbia and Montenegro', date : '14/01/2009' },
			{ name : 'Denton', email : 'facilisis@duinec.ca', city : 'Sturgis', country : 'China', date : '01/02/2009' },
			{ name : 'Jacob', email : 'magna.Ut.tincidunt@Donecporttitor.ca', city : 'Bremerton', country : 'Montserrat', date : '07/08/2008' },
			{ name : 'Yolanda', email : 'molestie.Sed.id@aliquetmolestie.ca', city : 'Detroit', country : 'Wallis and Futuna', date : '02/08/2008' },
			{ name : 'Nathaniel', email : 'eu@odioa.com', city : 'Hamilton', country : 'Puerto Rico', date : '06/11/2007' },
			{ name : 'Indigo', email : 'ac.risus.Morbi@ligula.edu', city : 'Hartford', country : 'Cyprus', date : '06/09/2007' },
			{ name : 'Vivian', email : 'amet.nulla.Donec@ametluctus.org', city : 'Bradbury', country : 'Timor-leste', date : '27/07/2007' },
			{ name : 'Imogene', email : 'sociis.natoque@semNullainterdum.org', city : 'Titusville', country : 'Thailand', date : '22/11/2008' },
			{ name : 'Rhiannon', email : 'elementum.dui.quis@diam.ca', city : 'Wichita Falls', country : 'Sierra Leone', date : '11/10/2008' },
			{ name : 'Raymond', email : 'vestibulum@luctusCurabitur.com', city : 'San Juan', country : 'Lesotho', date : '22/04/2009' },
			{ name : 'Felicia', email : 'amet.consectetuer@vulputate.edu', city : 'Bowie', country : 'Malta', date : '17/07/2009' },
			{ name : 'Jaquelyn', email : 'Duis.elementum@loremauctor.com', city : 'Mankato', country : 'Cape Verde', date : '27/07/2008' },
			{ name : 'Eric', email : 'elit.pellentesque.a@atpede.com', city : 'La Habra Heights', country : 'Myanmar', date : '25/10/2008' },
			{ name : 'Nyssa', email : 'enim.consequat@erat.ca', city : 'Riverton', country : 'Bosnia and Herzegovina', date : '03/10/2007' },
			{ name : 'Graham', email : 'parturient.montes.nascetur@magnamalesuada.com', city : 'Anderson', country : 'Germany', date : '12/07/2008' },
			{ name : 'Amity', email : 'leo.Morbi@loremDonec.org', city : 'Montgomery', country : 'Bulgaria', date : '22/08/2007' },
			{ name : 'Judith', email : 'lacus@eu.com', city : 'Valencia', country : 'Bosnia and Herzegovina', date : '19/01/2009' },
			{ name : 'Nita', email : 'erat@arcuet.edu', city : 'New Castle', country : 'India', date : '13/04/2008' },
			{ name : 'Talon', email : 'mi.tempor.lorem@ligulaAliquamerat.ca', city : 'Bend', country : 'Ireland', date : '05/02/2009' },
			{ name : 'Hayfa', email : 'eu@vestibulum.com', city : 'Hackensack', country : 'Bahamas', date : '01/10/2008' },
			{ name : 'Ila', email : 'Nulla@Maurisvestibulumneque.com', city : 'Virginia Beach', country : 'Bulgaria', date : '26/01/2009' },
			{ name : 'Harrison', email : 'eu@utodio.com', city : 'Sister Bay', country : 'Germany', date : '10/03/2009' },
			{ name : 'Clare', email : 'cursus.Integer.mollis@maurisid.edu', city : 'Aguadilla', country : 'Angola', date : '18/08/2008' },
			{ name : 'Clio', email : 'velit.Cras.lorem@quamvelsapien.org', city : 'Simi Valley', country : 'Paraguay', date : '06/02/2008' },
			{ name : 'Rachel', email : 'amet@blandit.com', city : 'Goose Creek', country : 'Trinidad and Tobago', date : '19/12/2007' },
			{ name : 'Phelan', email : 'nascetur.ridiculus.mus@egestas.edu', city : 'Macomb', country : 'Japan', date : '18/04/2009' },
			{ name : 'Tasha', email : 'Etiam.vestibulum@tempusmauris.edu', city : 'Meriden', country : 'Venezuela', date : '06/02/2008' },
			{ name : 'Stuart', email : 'vitae.erat.vel@eget.org', city : 'Sitka', country : 'China', date : '13/01/2008' },
			{ name : 'Rebecca', email : 'scelerisque.neque@vitae.org', city : 'Council Bluffs', country : 'Marshall Islands', date : '15/11/2008' },
			{ name : 'Nola', email : 'scelerisque.scelerisque@estarcuac.com', city : 'Hopkinsville', country : 'Myanmar', date : '09/12/2007' },
			{ name : 'Silas', email : 'semper.Nam@utnulla.org', city : 'Monroe', country : 'Germany', date : '11/07/2008' },
			{ name : 'Joan', email : 'lorem@temporloremeget.com', city : 'Berkeley', country : 'Palau', date : '05/02/2008' },
			{ name : 'Melyssa', email : 'neque.tellus@semperauctor.edu', city : 'Albany', country : 'Turkmenistan', date : '29/03/2008' },
			{ name : 'Nyssa', email : 'et.eros.Proin@urnaet.com', city : 'Apple Valley', country : 'Tajikistan', date : '08/06/2009' },
			{ name : 'Murphy', email : 'molestie@non.edu', city : 'La Habra Heights', country : 'Germany', date : '17/09/2007' },
			{ name : 'Halee', email : 'fermentum.arcu.Vestibulum@Cras.com', city : 'Wahoo', country : 'Turkmenistan', date : '27/02/2008' },
			{ name : 'Quynn', email : 'dapibus.ligula.Aliquam@arcuVivamussit.com', city : 'Tempe', country : 'Somalia', date : '29/06/2009' },
			{ name : 'Buffy', email : 'eu.dolor.egestas@lacus.com', city : 'Amesbury', country : 'Philippines', date : '02/11/2008' },
			{ name : 'Illiana', email : 'lorem.ut@vestibulum.com', city : 'Nacogdoches', country : 'United Arab Emirates', date : '16/07/2009' },
			{ name : 'Dalton', email : 'vitae.mauris.sit@nonlorem.edu', city : 'Hoover', country : 'Trinidad and Tobago', date : '11/12/2008' },
			{ name : 'Amber', email : 'erat.volutpat.Nulla@purus.ca', city : 'West Haven', country : 'Finland', date : '09/01/2008' },
			{ name : 'Kalia', email : 'orci@duiquis.com', city : 'Delta Junction', country : 'Togo', date : '30/06/2008' },
			{ name : 'Xantha', email : 'turpis@iaculisaliquet.ca', city : 'Laconia', country : 'Morocco', date : '18/07/2009' },
			{ name : 'Leah', email : 'odio.semper@tellussemmollis.com', city : 'New Britain', country : 'Sri Lanka', date : '24/06/2009' },
			{ name : 'Darrel', email : 'auctor.vitae@vitaeposuere.ca', city : 'Pierre', country : 'Saint Pierre and Miquelon', date : '08/11/2007' },
			{ name : 'Brennan', email : 'Nunc@nullaDonec.org', city : 'Lafayette', country : 'Micronesia', date : '04/09/2007' },
			{ name : 'Lani', email : 'mollis.non@egestasligulaNullam.org', city : 'Manitowoc', country : 'Venezuela', date : '10/04/2009' },
			{ name : 'Dana', email : 'quam.Curabitur@Integer.com', city : 'Starkville', country : 'Georgia', date : '10/02/2009' },
			{ name : 'Rachel', email : 'ante.ipsum.primis@interdum.com', city : 'Saint Joseph', country : 'Timor-leste', date : '07/02/2008' },
			{ name : 'Lamar', email : 'magna@dignissim.ca', city : 'Riverton', country : 'Bulgaria', date : '02/10/2008' },
			{ name : 'Kyle', email : 'Nullam.ut.nisi@eleifendnuncrisus.org', city : 'Tuscaloosa', country : 'Oman', date : '17/10/2008' },
			{ name : 'Colette', email : 'rhoncus.Donec@Duis.org', city : 'New Kensington', country : 'Niger', date : '18/01/2008' },
			{ name : 'Hedwig', email : 'ante.blandit@Phasellus.com', city : 'Auburn Hills', country : 'Greece', date : '20/01/2009' },
			{ name : 'Jordan', email : 'sociis.natoque@sit.com', city : 'Corona', country : 'Albania', date : '17/12/2007' },
			{ name : 'Brock', email : 'dui@Phasellusnulla.ca', city : 'Detroit', country : 'Belize', date : '08/11/2007' },
			{ name : 'Iris', email : 'velit.Quisque.varius@neque.edu', city : 'West Allis', country : 'Timor-leste', date : '04/07/2009' },
			{ name : 'Geoffrey', email : 'at.egestas@sed.edu', city : 'Kokomo', country : 'Malta', date : '15/07/2009' },
			{ name : 'Liberty', email : 'tellus.faucibus.leo@mollis.ca', city : 'Bandera', country : 'Guyana', date : '23/08/2008' },
			{ name : 'Athena', email : 'vulputate@malesuadavelconvallis.edu', city : 'Auburn', country : 'French Guiana', date : '11/07/2008' },
			{ name : 'Belle', email : 'non.massa@eleifendnunc.org', city : 'La Verne', country : 'Senegal', date : '09/04/2008' },
			{ name : 'Cathleen', email : 'accumsan.laoreet@dictum.com', city : 'Rosemead', country : 'Cocos (Keeling) Islands', date : '29/04/2008' },
			{ name : 'Francesca', email : 'mollis.Duis@Maecenaslibero.com', city : 'Webster Groves', country : 'Dominica', date : '13/04/2009' },
			{ name : 'Elvis', email : 'vitae.mauris.sit@aliquam.edu', city : 'La Jolla', country : 'Cambodia', date : '23/07/2009' },
			{ name : 'Merritt', email : 'erat@dolor.edu', city : 'Taylorsville', country : 'Slovenia', date : '27/04/2008' },
			{ name : 'Noah', email : 'urna.Ut.tincidunt@diam.ca', city : 'Leominster', country : 'Korea', date : '01/04/2009' },
			{ name : 'Carolyn', email : 'eu.erat.semper@sollicitudina.ca', city : 'Montebello', country : 'Gabon', date : '24/09/2008' },
			{ name : 'Steel', email : 'ipsum.sodales.purus@ullamcorperDuisat.ca', city : 'Bend', country : 'Panama', date : '28/03/2008' },
			{ name : 'Adele', email : 'consectetuer.adipiscing.elit@lacusQuisque.org', city : 'Klamath Falls', country : 'Reunion', date : '14/11/2008' },
			{ name : 'Ivana', email : 'convallis.dolor@Morbinon.org', city : 'Auburn Hills', country : 'Jordan', date : '28/12/2007' },
			{ name : 'Deanna', email : 'sit@et.com', city : 'Moreno Valley', country : 'United Kingdom', date : '11/06/2009' },
			{ name : 'Brynn', email : 'magna@nisl.ca', city : 'Shreveport', country : 'Albania', date : '20/11/2008' },
			{ name : 'Philip', email : 'Aenean.eget@tinciduntadipiscingMauris.edu', city : 'Leominster', country : 'Russian Federation', date : '17/05/2008' },
			{ name : 'Lesley', email : 'volutpat.ornare@ascelerisquesed.com', city : 'Galveston', country : 'Finland', date : '29/02/2008' },
			{ name : 'Isabella', email : 'Mauris@duiFusce.edu', city : 'Kemmerer', country : 'Myanmar', date : '01/04/2008' },
			{ name : 'Clinton', email : 'tempus@velit.org', city : 'Cudahy', country : 'Afghanistan', date : '28/07/2007' },
			{ name : 'Clark', email : 'tristique.aliquet.Phasellus@Proinmi.com', city : 'Decatur', country : 'Mauritania', date : '05/04/2009' },
			{ name : 'Raven', email : 'varius.orci@sitametluctus.ca', city : 'Burlingame', country : 'Greenland', date : '01/12/2008' },
			{ name : 'Solomon', email : 'ac.turpis.egestas@elementum.com', city : 'Waltham', country : 'Armenia', date : '17/04/2008' },
			{ name : 'Lois', email : 'Cras.lorem.lorem@Pellentesquetincidunttempus.com', city : 'Springfield', country : 'Latvia', date : '03/02/2008' },
			{ name : 'Finn', email : 'mauris.ut@pede.edu', city : 'South Burlington', country : 'Pakistan', date : '10/01/2009' },
			{ name : 'Orson', email : 'sed@rutrumFusce.org', city : 'Wisconsin Dells', country : 'Tunisia', date : '05/04/2009' },
			{ name : 'Evan', email : 'mollis.Duis.sit@semper.edu', city : 'Columbia', country : 'Rwanda', date : '07/09/2008' },
			{ name : 'Sloane', email : 'imperdiet.dictum@at.com', city : 'New Madrid', country : 'Costa Rica', date : '27/12/2008' },
			{ name : 'Ashton', email : 'dolor.Fusce@dolorsitamet.com', city : 'Nichols Hills', country : 'Macedonia', date : '15/05/2009' },
			{ name : 'Maile', email : 'Mauris@erategetipsum.edu', city : 'Mission Viejo', country : 'Azerbaijan', date : '07/08/2008' },
			{ name : 'Xenos', email : 'pede.nonummy.ut@non.com', city : 'Somersworth', country : 'Svalbard and Jan Mayen', date : '26/01/2009' },
			{ name : 'Samson', email : 'dolor.Fusce@risusaultricies.org', city : 'Warner Robins', country : 'Uruguay', date : '21/11/2007' },
			{ name : 'Chester', email : 'accumsan.neque@laoreetliberoet.org', city : 'Lexington', country : 'Iran, Islamic Republic of', date : '08/02/2009' },
			{ name : 'Moana', email : 'odio.Nam@ettristique.org', city : 'Liberal', country : 'Saint Vincent and The Grenadines', date : '02/10/2007' },
			{ name : 'Jana', email : 'malesuada.vel.convallis@nonarcu.org', city : 'Fall River', country : 'Uganda', date : '11/08/2008' },
			{ name : 'Cade', email : 'montes@volutpat.org', city : 'Williston', country : 'Bahamas', date : '16/12/2008' },
			{ name : 'Alexander', email : 'scelerisque.sed.sapien@eleifendnuncrisus.org', city : 'Detroit', country : 'Bosnia and Herzegovina', date : '03/04/2008' },
			{ name : 'Cherokee', email : 'dapibus@utmiDuis.edu', city : 'Redlands', country : 'Italy', date : '09/01/2008' },
			{ name : 'Pascale', email : 'facilisis.Suspendisse@nonfeugiatnec.edu', city : 'Rolling Hills', country : 'Kazakhstan', date : '21/04/2008' },
			{ name : 'Indigo', email : 'purus.in@accumsan.com', city : 'Hastings', country : 'Angola', date : '05/06/2008' },
			{ name : 'Gannon', email : 'aliquam.iaculis@eueuismodac.edu', city : 'Taylorsville', country : 'Burundi', date : '02/11/2008' },
			{ name : 'Hasad', email : 'non.lorem@magnased.ca', city : 'San Gabriel', country : 'Cook Islands', date : '13/05/2009' },
			{ name : 'Jenna', email : 'et.pede@maurisipsumporta.ca', city : 'Dover', country : 'El Salvador', date : '08/02/2008' },
			{ name : 'Constance', email : 'dignissim.tempor.arcu@nulla.ca', city : 'Downey', country : 'Liechtenstein', date : '01/03/2008' },
			{ name : 'Ginger', email : 'faucibus@cursus.edu', city : 'La Ca�ada Flintridge', country : 'Maldives', date : '31/01/2008' },
			{ name : 'Lee', email : 'et.euismod@purus.org', city : 'Edina', country : 'United Arab Emirates', date : '18/03/2009' },
			{ name : 'Georgia', email : 'nulla@vulputate.ca', city : 'Kahului', country : 'Gibraltar', date : '26/05/2009' },
			{ name : 'Merritt', email : 'blandit@Suspendissenonleo.ca', city : 'Gilette', country : 'France', date : '21/11/2008' },
			{ name : 'Baxter', email : 'at.pretium@ultricies.com', city : 'North Platte', country : 'Guatemala', date : '13/01/2009' }
		],
		total              : 600
	};
	data.items_big  = data.items.concat( data.items );
	data.items_mega = data.items_big.concat( data.items );
	

	test( 'Tokens can be replaced with Dictionary values', function( done ) {
		var tpl0 = new Templ8( '{{total}}',              { compiled : true, id : 'test.tpl.0' } ),
			tpl1 = new Templ8( '{{columns.name.width}}', { compiled : true, id : 'test.tpl.1' } ),
			tpl2 = new Templ8( '{{items.10.email}}',     { compiled : true, id : 'test.tpl.2' } );

		expect( tpl0.parse( data ) ).to.equal( '600' );
		expect( tpl1.parse( data ) ).to.equal( '6' );
		expect( tpl2.parse( data ).trim() ).to.equal( 'ultrices.sit.amet@nullamagnamalesuada.ca' );
		
		done();
	} );

	test( 'Dictionary values can be altered using filter(s)', function( done ) {
		var tpl0 = new Templ8( '{{total|bold}}',                 { compiled : true, id : 'test.tpl.0' } ),
			tpl1 = new Templ8( '{{columns.name.width|italics}}', { compiled : true, id : 'test.tpl.1' } ),
			tpl2 = new Templ8( '{{items.10.email|link|bold}}',   { compiled : true, id : 'test.tpl.2' } );

		expect( tpl0.parse( data ).trim() ).to.equal( '<strong>600</strong>' );
		expect( tpl1.parse( data ).trim() ).to.equal( '<em>6</em>' );
		expect( tpl2.parse( data ).trim() ).to.equal( '<strong><a href="mailto:ultrices.sit.amet@nullamagnamalesuada.ca">ultrices.sit.amet@nullamagnamalesuada.ca</a></strong>' );

		done();
	} );

	test( 'Filter(s) can include custom parameters to alter Dictionary values with', function( done ) {
		var tpl0 = new Templ8( '{{items.10.email|link:items.10.name|prefix:"email - "|paragraph}}', { compiled : true, id : 'test.tpl.0' } );

		expect( tpl0.parse( data ).trim() ).to.equal( '<p>email - <a href="mailto:ultrices.sit.amet@nullamagnamalesuada.ca">Zahir</a></p>' );

		done();
	} );

	test( 'Simple "if" statements can be placed within an interpolation tag', function( done ) {
		var tpl0 = new Templ8( '{{items.10.email if items.10.email}}',                                                         { compiled : true, id : 'test.tpl.0' } ),
			tpl1 = new Templ8( '{{items.10.email|link:items.10.name|prefix:"email - "|paragraph if items.10.email|notEmpty}}', { compiled : true, id : 'test.tpl.1' } ),
			tpl2 = new Templ8( '{{items.10.email|link:items.10.name|prefix:"email - "|paragraph if items.10.email|empty}}',    { compiled : true, id : 'test.tpl.2' } );

		expect( tpl0.parse( data ).trim() ).to.equal( 'ultrices.sit.amet@nullamagnamalesuada.ca' );
		expect( tpl1.parse( data ).trim() ).to.equal( '<p>email - <a href="mailto:ultrices.sit.amet@nullamagnamalesuada.ca">Zahir</a></p>' );
		expect( tpl2.parse( data ).trim() ).to.be.empty;

		done();
	} );

	test( 'Simple "unless" statements can be placed within an interpolation tag', function( done ) {
		var tpl0 = new Templ8( '{{items.10.email|link:items.10.name|prefix:"email - "|paragraph unless items.10.email|notEmpty }}', { compiled : true, id : 'test.tpl.0' } ),
			tpl1 = new Templ8( '{{items.10.email|link:items.10.name|prefix:"email - "|paragraph unless items.10.email|empty }}',    { compiled : true, id : 'test.tpl.1' } );

		expect( tpl0.parse( data ).trim() ).to.be.empty;
		expect( tpl1.parse( data ).trim() ).to.equal( '<p>email - <a href="mailto:ultrices.sit.amet@nullamagnamalesuada.ca">Zahir</a></p>' );

		done();
	} );

	test( 'An "if" statement will parse its contents if its condition evaluates to true', function( done ) {
		var tpl0 = new Templ8(  '{% if items.10.email|notEmpty %}',
									'{{items.10.email|link:items.10.name|prefix:"email - "|paragraph}}',
								'{% endif %}', { compiled : true, id : 'test.tpl.0' } ),

			tpl1 = new Templ8(  '{% if items.10.email|empty %}',
'										{{items.10.email|link:items.10.name|prefix:"email - "|paragraph}}',
								'{% endif %}', { compiled : true, id : 'test.tpl.1' } );

		expect( tpl0.parse( data ).trim() ).to.equal( '<p>email - <a href="mailto:ultrices.sit.amet@nullamagnamalesuada.ca">Zahir</a></p>' );
		expect( tpl1.parse( data ).trim() ).to.be.empty;

		done();
	} );

	test( 'An "if" statement uses the words "AND" and "OR" in place of regular logical "&&" and "||".', function( done ) {
		var tpl0 = new Templ8(  '{% if items.10.email|notEmpty AND items.10.name|equals:"Zahir" %}',
									'{{items.10.email|link:items.10.name|prefix:"email - "|paragraph}}',
								'{% endif %}', { compiled : true, id : 'test.tpl.0' } ),

			tpl1 = new Templ8(  '{% if items.10.email|empty OR items.10.name != "Zahir" %}',
									'{{items.10.email|link:items.10.name|prefix:"email - "|paragraph}}',
								'{% endif %}', { compiled : true, id : 'test.tpl.1' } );

		expect( tpl0.parse( data ).trim() ).to.equal( '<p>email - <a href="mailto:ultrices.sit.amet@nullamagnamalesuada.ca">Zahir</a></p>' );
		expect( tpl1.parse( data ).trim() ).to.be.empty;

		done();
	} );

	test( 'An "elseif" statement will parse its contents if its condition evaluates to true and the associated "if" condition above it evaluates to false', function( done ) {
		var tpl0 = new Templ8(  '{% if items.10.email|empty %}',
									'items empty',
								'{% elsif items.10.email|notEmpty %}',
									'{{items.10.email|link:items.10.name|prefix:"email - "|paragraph}}',
								'{% endif %}', { compiled : true, id : 'test.tpl.0' } );

		expect( tpl0.parse( data ).trim() ).to.equal( '<p>email - <a href="mailto:ultrices.sit.amet@nullamagnamalesuada.ca">Zahir</a></p>' );

		done();
	} );

	test( 'An "else" statement will parse its contents if all other associated "if" / "elseif" conditions above it evaluate to false', function( done ) {
		var tpl0 = new Templ8(  '{% if items.10.email|empty %}',
									'items empty',
								'{% else %}',
									'{{items.10.email|link:items.10.name|prefix:"email - "|paragraph}}',
								'{% endif %}', { compiled : true, id : 'test.tpl.0' } );

		expect( tpl0.parse( data ).trim() ).to.equal( '<p>email - <a href="mailto:ultrices.sit.amet@nullamagnamalesuada.ca">Zahir</a></p>' );

		done();
	} );

	test( '"if"/ "elseif"/ "else" statements will parse their contents based on which conditions evaluate to true', function( done ) {
		var tpl0 = new Templ8(  '{% if foo == 1 %}',
									'foo equals 1',
								'{% elsif foo == 0 %}',
									'foo equals 0',
								'{% elsif foo == -1 %}',
									'foo equals -1',
								'{% else %}',
									'foo equals {{foo}}',
								'{% endif %}', { compiled : true, id : 'test.tpl.0' } );

		expect( tpl0.parse( { foo :  1 } ) ).to.equal( 'foo equals 1'  );
		expect( tpl0.parse( { foo :  0 } ) ).to.equal( 'foo equals 0'  );
		expect( tpl0.parse( { foo : -1 } ) ).to.equal( 'foo equals -1' );
		expect( tpl0.parse( { foo :  2 } ) ).to.equal( 'foo equals 2'  );

		done();
	} );

	test( 'The "for" statement allows you to iterate over Dictionary values which are JavaScript Arrays', function( done ) {
		var e1 = '<p>1. <a href="mailto:at.pretium@ultricies.com">Baxter</a></p><p>2. <a href="mailto:arcu@purusgravida.org">Alyssa</a></p><p>3. <a href="mailto:vehicula@temporarcu.org">Fleur</a></p><p>4. <a href="mailto:Vivamus@semmollis.org">Norman</a></p><p>5. <a href="mailto:Nulla.tempor@adipiscing.ca">Bryar</a></p>',
			e2 = '<p>1. <a href="mailto:at.pretium@ultricies.com">Baxter</a></p><p>2. <a href="mailto:arcu@purusgravida.org">Alyssa</a></p><p>3. <a href="mailto:vehicula@temporarcu.org">Fleur</a></p><p>4. <a href="mailto:Vivamus@semmollis.org">Norman</a></p>',
			e3 = '<p>3. <a href="mailto:vehicula@temporarcu.org">Fleur</a></p><p>4. <a href="mailto:Vivamus@semmollis.org">Norman</a></p><p>5. <a href="mailto:Nulla.tempor@adipiscing.ca">Bryar</a></p>',
			tpl0 = new Templ8(  '{% for items_small %}',
									'<p>{{iter.index1}}. {{iter.current.email|link:$_.name}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.0' } ),

			tpl1 = new Templ8(  '{% for item in items_small %}',
									'<p>{{iter.index1}}. {{item.email|link:item.name}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.1' } ),

			tpl2 = new Templ8(  '{% for items_small [1..3] %}',
									'<p>{{iter.index1}}. {{iter.current.email|link:$_.name}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.2' } ),

			tpl3 = new Templ8(  '{% for items_small [3..] %}',
									'<p>{{iter.index1}}. {{iter.current.email|link:$_.name}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.3' } ),

			tpl4 = new Templ8(  '{% for item in items_small [1..3] %}',
									'<p>{{iter.index1}}. {{item.email|link:item.name}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.4' } ),

			tpl5 = new Templ8(  '{% for item in items_small [3..] %}',
									'<p>{{iter.index1}}. {{item.email|link:$_.name}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.5' } );

		expect( tpl0.parse( data ) ).to.equal( e1 );
		expect( tpl1.parse( data ) ).to.equal( e1 );
		expect( tpl2.parse( data ) ).to.equal( e2 );
		expect( tpl3.parse( data ) ).to.equal( e3 );
		expect( tpl4.parse( data ) ).to.equal( e2 );
		expect( tpl5.parse( data ) ).to.equal( e3 );

		done();
	} );

	test( 'Iter instance', function( done ) {
		var tpl0 = new Templ8(  '{% for items_small [0..2] %}',
									'<index>{{iter.index}}</index><prevIndex>{{iter.prevIndex}}</prevIndex><nextIndex>{{iter.nextIndex}}</nextIndex><first>{{iter.first.name}}</first><last>{{iter.last.name}}</last><next>{{iter.next.name if iter.next|exists }}</next><prev>{{iter.prev.name if iter.prev|exists }}</prev>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.0' } );

		expect( tpl0.parse( data ) ).to.equal( '<index>0</index><prevIndex>undefined</prevIndex><nextIndex>1</nextIndex><first>Baxter</first><last>Fleur</last><next>Alyssa</next><prev></prev><index>1</index><prevIndex>0</prevIndex><nextIndex>2</nextIndex><first>Baxter</first><last>Fleur</last><next>Fleur</next><prev>Baxter</prev><index>2</index><prevIndex>1</prevIndex><nextIndex>undefined</nextIndex><first>Baxter</first><last>Fleur</last><next></next><prev>Alyssa</prev>' );

		done();
	} );

	test( 'The "for" statement allows you to iterate over Dictionary values which are JavaScript Objects', function( done ) {
		var e1 = '<p>1. name: 6</p><p>2. email: 21</p><p>3. city: 22</p><p>4. country: 23</p><p>5. date: 24</p>',
			e2 = '<p>1. name: 6</p><p>2. email: 21</p><p>3. city: 22</p><p>4. country: 23</p>',
			e3 = '<p>3. city: 22</p><p>4. country: 23</p><p>5. date: 24</p>',
			tpl0 = new Templ8(  '{% for columns %}',
									'<p>{{iter.index1}}. {{iter.key}}: {{iter.current.width}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.0' } ),

			tpl1 = new Templ8(  '{% for col in columns %}',
									'<p>{{iter.index1}}. {{iter.key}}: {{col.width}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.1' } ),

			tpl2 = new Templ8(  '{% for columns [1..3] %}',
									'<p>{{iter.index1}}. {{iter.key}}: {{$_.width}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.2' } ),

			tpl3 = new Templ8(  '{% for columns [3..] %}',
									'<p>{{iter.index1}}. {{iter.key}}: {{$_.width}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.3' } ),

			tpl4 = new Templ8(  '{% for col in columns [1..3] %}',
									'<p>{{iter.index1}}. {{iter.key}}: {{col.width}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.4' } ),

			tpl5 = new Templ8(  '{% for col in columns [3..] %}',
									'<p>{{iter.index1}}. {{iter.key}}: {{col.width}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.5' } ),

			tpl6 = new Templ8(  '{% for [k, v] in columns [1..3] %}',
									'<p>{{iter.index1}}. {{k}}: {{v.width}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.6' } ),

			tpl7 = new Templ8(  '{% for [k,v] in columns [3..] %}',
									'<p>{{iter.index1}}. {{k}}: {{v.width}}</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.7' } );

		expect( tpl0.parse( data ) ).to.equal( e1 );
		expect( tpl1.parse( data ) ).to.equal( e1 );
		expect( tpl2.parse( data ) ).to.equal( e2 );
		expect( tpl3.parse( data ) ).to.equal( e3 );
		expect( tpl4.parse( data ) ).to.equal( e2 );
		expect( tpl5.parse( data ) ).to.equal( e3 );
		expect( tpl6.parse( data ) ).to.equal( e2 );
		expect( tpl7.parse( data ) ).to.equal( e3 );

		done();
	} );

	test( 'The "forempty" statement allows you to supply a fallback for a Dictionary value which is non-iterable or empty', function( done ) {
		var tpl0 = new Templ8(  '{% for items_empty_array %}',
									'<p>FAIL</p>',
								'{% forempty %}',
									'<p>PASS</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.0' } ),

			tpl1 = new Templ8(  '{% for items_empty_object %}',
									'<p>FAIL</p>',
								'{% forempty %}',
									'<p>PASS</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.0' } ),

			tpl2 = new Templ8(  '{% for items_nonexistent %}',
									'<p>FAIL</p>',
								'{% forempty %}',
									'<p>PASS</p>',
								'{% endfor %}', { compiled : true, id : 'test.tpl.1' } );

		expect( tpl0.parse( data ) ).to.equal( '<p>PASS</p>' );
		expect( tpl1.parse( data ) ).to.equal( '<p>PASS</p>' );
		expect( tpl2.parse( data ) ).to.equal( '<p>PASS</p>' );

		done();
	} );

	test( 'A "sub" Templ8 can be used to reuse repeated functionality', function( done ) {
		var tpl1 = new Templ8(  '{% sub sub_template %}<p>{{$_}}</p>{% endsub %}',
								'{{title|parse:"test.tpl1.sub_template"}}',
								{ compiled : true, id : 'test.tpl1' } ),

			tpl2 = new Templ8(  '{% sub sub_template %}<p>{{$_|parse:"test.subtpl.sub_template2"}}</p>{% endsub %}',
								'{% sub sub_template2 %}<strong>{{$_}}</strong>{% endsub %}',
								'{{title|parse:"test.subtpl.sub_template"}}',
								{ compiled : true, id : 'test.subtpl' } );

		expect( tpl1.parse( data ) ).to.equal( '<p>Test data</p>' );
//		expect( tpl2.parse( data ) ).to.equal( '<p><strong>Test data</strong></p>' );

		done();
	} );

	test( 'Array comprehensions can be used to iterate over Arrays and/ or Objects', function( done ) {
		var tpl0  = new Templ8( '{[ v for each ( v in items )]}',                                { compiled : true, id : 'test.tpl.0'  } ),
			tpl1  = new Templ8( '{[ v for each ( v in items ) if v < 4 ]}',                      { compiled : true, id : 'test.tpl.1'  } ),
			tpl2  = new Templ8( '{[ v for each ( v in items ) unless v > 3 ]}',                  { compiled : true, id : 'test.tpl.2'  } ),
			tpl3  = new Templ8( '{[ $_ for each ( items ) ]}',                                   { compiled : true, id : 'test.tpl.3'  } ),
			tpl4  = new Templ8( '{[ $_ for each ( items ) if $_ < 4 ]}',                         { compiled : true, id : 'test.tpl.4'  } ),
			tpl5  = new Templ8( '{[ iter.current for each ( items ) unless iter.current > 3 ]}', { compiled : true, id : 'test.tpl.5'  } ),
			tpl6  = new Templ8( '{[ v + k for each ( [k,v] in items ) ]}',                       { compiled : true, id : 'test.tpl.6'  } ),
			tpl7  = new Templ8( '{[ v + k for each ( [k, v] in items ) if v < 4 ]}',             { compiled : true, id : 'test.tpl.7'  } ),
			tpl8  = new Templ8( '{[ v for each ( [k, v] in items ) unless v > 3 ]}',             { compiled : true, id : 'test.tpl.8'  } ),
			tpl9  = new Templ8( '{[ v + k for each ( [k, v] in items [2..5] ) if v < 4 ]}',      { compiled : true, id : 'test.tpl.9'  } ),
			tpl10 = new Templ8( '{[ v + k for each ( [k, v] in items [3..] ) unless v == 3 ]}',  { compiled : true, id : 'test.tpl.10' } );

		expect( tpl0.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(  '123456' );
		expect( tpl1.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(     '123' );
		expect( tpl2.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(     '123' );
		expect( tpl3.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(  '123456' );
		expect( tpl4.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(     '123' );
		expect( tpl5.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(     '123' );
		expect( tpl6.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal( '1357911' );//
		expect( tpl7.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(     '135' );//
		expect( tpl8.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(     '123' );
		expect( tpl9.parse(  { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(      '35' );//
		expect( tpl10.parse( { items : [1, 2, 3, 4, 5, 6] } ) ).to.equal(    '7911' );//
		expect( tpl0.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal( '123456' );
		expect( tpl1.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal(    '123' );
		expect( tpl2.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal(    '123' );
		expect( tpl3.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal( '123456' );
		expect( tpl4.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal(    '123' );
		expect( tpl5.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal(    '123' );
		expect( tpl6.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal( '1one2two3three4four5five6six' );
		expect( tpl7.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal( '1one2two3three' );
		expect( tpl8.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal(    '123' );
		expect( tpl9.parse(  { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal( '2two3three' );
		expect( tpl10.parse( { items : { one : 1, two : 2, three : 3, four : 4, five : 5, six : 6 } } ) ).to.equal( '4four5five6six' );

		done();
	} );

	test( 'Arbitrary JavaScript can be executed within a Templ8', function( done ) {
		var tpl = new Templ8( '{: ( function( v ) { root.tpl_test_value = v; }( true ) ); :}', { compiled : true, id : 'test.tpl' } );

		tpl.parse( data );

		expect( m8.global.tpl_test_value ).to.be.true;

		done();
	} );

	test( 'Comments will not be parsed and thus not affect a Templ8\'s output', function( done ) {
		var tpl = new Templ8( '{# test comments #}', { compiled : true, id : 'test.tpl' } );

		expect( tpl.parse( data ) ).to.be.empty;

		done();
	} );

	test( '<static> format can perform simple string substitutions', function( done ) {
		expect( Templ8.format( 'Hello {3}, a {0}, a {1}, a {0}, {1}, {2}, HIT IT!!!', 1, 2, 3, 'World' ) ).to.equal( 'Hello World, a 1, a 2, a 1, 2, 3, HIT IT!!!' );

		done();
	} );

	test( '<static> gsub can perform simple string substitutions', function( done ) {
		expect( Templ8.gsub( 'Hello {name}, a {first}, a {second}, a {first}, {second}, {third}, HIT IT!!!', { first : 1, second : 2, third : 3, name : 'World' } ) ).to.equal( 'Hello World, a 1, a 2, a 1, 2, 3, HIT IT!!!' );

		done();
	} );
} );
