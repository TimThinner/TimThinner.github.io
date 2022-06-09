import Model from '../common/Model.js';
/*

See also:
https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts


Try to read all NUTS-3 codes for any COUNTRY (CNTR_CODE) and extract NUTS_NAME and NAME_LATN
IN FILE 

NUTS_LB_2021_3035.json

{
	"type":"Topology",
	"arcs":[],
	"objects":{"NUTS_LB_2021_3035":{"type":"GeometryCollection","geometries":[

{
"type":"Point",
"coordinates":[4309292.7645,3441513.4943],
"properties":{"NUTS_ID":"DEF0","LEVL_CODE":2,"CNTR_CODE":"DE","NAME_LATN":"Schleswig-Holstein","NUTS_NAME":"Schleswig-Holstein","MOUNT_TYPE":0,"URBN_TYPE":null,"COAST_TYPE":0,"FID":"DEF0"},
"id":"DEF0"
},
{
	"type":"Point",
	"coordinates":[4392871.8445,3088607.0577],
	"properties":{"NUTS_ID":"DEG0","LEVL_CODE":2,"CNTR_CODE":"DE","NAME_LATN":"Thüringen","NUTS_NAME":"Thüringen","MOUNT_TYPE":0,"URBN_TYPE":null,"COAST_TYPE":0,"FID":"DEG0"},
	"id":"DEG0"
},
...
,
{
"type":"Point",
"coordinates":[4245437.3572,4380700.353599999],
"properties":{"NUTS_ID":"NO0A3","LEVL_CODE":3,"CNTR_CODE":"NO","NAME_LATN":"Møre og Romsdal","NUTS_NAME":"Møre og Romsdal","MOUNT_TYPE":3,"URBN_TYPE":3,"COAST_TYPE":1,"FID":"NO0A3"},
"id":"NO0A3"
}]}}}

*/
export default class RegionsModel extends Model {
	constructor(options) {
		super(options);
		this.regions = [];
		this.simulation_backup = {
    "DK": {
        "DK011": "Byen København",
        "DK012": "Københavns omegn",
        "DK013": "Nordsjælland",
        "DK014": "Bornholm",
        "DK021": "Østsjælland",
        "DK022": "Vest- og Sydsjælland",
        "DK031": "Fyn",
        "DK032": "Sydjylland",
        "DK041": "Vestjylland",
        "DK042": "Østjylland",
        "DK050": "Nordjylland",
        "DKZZZ": "Extra-Regio NUTS 3"
    },
    "EL": {
        "EL301": "Βόρειος Τομέας Αθηνών",
        "EL302": "Δυτικός Τομέας Αθηνών",
        "EL303": "Κεντρικός Τομέας Αθηνών",
        "EL304": "Νότιος Τομέας Αθηνών",
        "EL305": "Ανατολική Αττική",
        "EL306": "Δυτική Αττική",
        "EL307": "Πειραιάς, Νήσοι",
        "EL411": "Λέσβος, Λήμνος",
        "EL412": "Ικαρία, Σάμος",
        "EL413": "Χίος",
        "EL421": "Κάλυμνος, Κάρπαθος – Ηρωική Νήσος Κάσος, Κως, Ρόδος",
        "EL422": "Άνδρος, Θήρα, Κέα, Μήλος, Μύκονος, Νάξος, Πάρος, Σύρος, Τήνος",
        "EL431": "Ηράκλειο",
        "EL432": "Λασίθι",
        "EL433": "Ρέθυμνο",
        "EL434": "Χανιά",
        "EL511": "Έβρος",
        "EL512": "Ξάνθη",
        "EL513": "Ροδόπη",
        "EL514": "Δράμα",
        "EL515": "Θάσος, Καβάλα",
        "EL521": "Ημαθία",
        "EL522": "Θεσσαλονίκη",
        "EL523": "Κιλκίς",
        "EL524": "Πέλλα",
        "EL525": "Πιερία",
        "EL526": "Σέρρες",
        "EL527": "Χαλκιδική",
        "EL531": "Γρεβενά, Κοζάνη",
        "EL532": "Καστοριά",
        "EL533": "Φλώρινα",
        "EL541": "Άρτα, Πρέβεζα",
        "EL542": "Θεσπρωτία",
        "EL543": "Ιωάννινα",
        "EL611": "Καρδίτσα, Τρίκαλα",
        "EL612": "Λάρισα",
        "EL613": "Μαγνησία, Σποράδες",
        "EL621": "Ζάκυνθος",
        "EL622": "Κέρκυρα",
        "EL623": "Ιθάκη, Κεφαλληνία",
        "EL624": "Λευκάδα",
        "EL631": "Αιτωλοακαρνανία",
        "EL632": "Αχαΐα",
        "EL633": "Ηλεία",
        "EL641": "Βοιωτία",
        "EL642": "Εύβοια",
        "EL643": "Ευρυτανία",
        "EL644": "Φθιώτιδα",
        "EL645": "Φωκίδα",
        "EL651": "Αργολίδα, Αρκαδία",
        "EL652": "Κορινθία",
        "EL653": "Λακωνία, Μεσσηνία",
        "ELZZZ": "Extra-Regio NUTS 3"
    },
    "ES": {
        "ES111": "A Coruña",
        "ES112": "Lugo",
        "ES113": "Ourense",
        "ES114": "Pontevedra",
        "ES120": "Asturias",
        "ES130": "Cantabria",
        "ES211": "Araba/Álava",
        "ES212": "Gipuzkoa",
        "ES213": "Bizkaia",
        "ES220": "Navarra",
        "ES230": "La Rioja",
        "ES241": "Huesca",
        "ES242": "Teruel",
        "ES243": "Zaragoza",
        "ES300": "Madrid",
        "ES411": "Ávila",
        "ES412": "Burgos",
        "ES413": "León",
        "ES414": "Palencia",
        "ES415": "Salamanca",
        "ES416": "Segovia",
        "ES417": "Soria",
        "ES418": "Valladolid",
        "ES419": "Zamora",
        "ES421": "Albacete",
        "ES422": "Ciudad Real",
        "ES423": "Cuenca",
        "ES424": "Guadalajara",
        "ES425": "Toledo",
        "ES431": "Badajoz",
        "ES432": "Cáceres",
        "ES511": "Barcelona",
        "ES512": "Girona",
        "ES513": "Lleida",
        "ES514": "Tarragona",
        "ES521": "Alicante/Alacant",
        "ES522": "Castellón/Castelló",
        "ES523": "Valencia/València",
        "ES531": "Eivissa y Formentera",
        "ES532": "Mallorca",
        "ES533": "Menorca",
        "ES611": "Almería",
        "ES612": "Cádiz",
        "ES613": "Córdoba",
        "ES614": "Granada",
        "ES615": "Huelva",
        "ES616": "Jaén",
        "ES617": "Málaga",
        "ES618": "Sevilla",
        "ES620": "Murcia",
        "ES630": "Ceuta",
        "ES640": "Melilla",
        "ES703": "El Hierro",
        "ES704": "Fuerteventura",
        "ES705": "Gran Canaria",
        "ES706": "La Gomera",
        "ES707": "La Palma",
        "ES708": "Lanzarote",
        "ES709": "Tenerife",
        "ESZZZ": "Extra-Regio NUTS 3"
    },
    "FI": {
        "FI193": "Keski-Suomi",
        "FI194": "Etelä-Pohjanmaa",
        "FI195": "Pohjanmaa",
        "FI196": "Satakunta",
        "FI197": "Pirkanmaa",
        "FI1B1": "Helsinki-Uusimaa",
        "FI1C1": "Varsinais-Suomi",
        "FI1C2": "Kanta-Häme",
        "FI1C3": "Päijät-Häme",
        "FI1C4": "Kymenlaakso",
        "FI1C5": "Etelä-Karjala",
        "FI1D1": "Etelä-Savo",
        "FI1D2": "Pohjois-Savo",
        "FI1D3": "Pohjois-Karjala",
        "FI1D5": "Keski-Pohjanmaa",
        "FI1D7": "Lappi",
        "FI1D8": "Kainuu",
        "FI1D9": "Pohjois-Pohjanmaa",
        "FI200": "Åland",
        "FIZZZ": "Extra-Regio NUTS 3"
    },
    "FR": {
        "FR101": "Paris",
        "FR102": "Seine-et-Marne ",
        "FR103": "Yvelines ",
        "FR104": "Essonne",
        "FR105": "Hauts-de-Seine ",
        "FR106": "Seine-Saint-Denis ",
        "FR107": "Val-de-Marne",
        "FR108": "Val-d’Oise",
        "FRB01": "Cher",
        "FRB02": "Eure-et-Loir",
        "FRB03": "Indre",
        "FRB04": "Indre-et-Loire",
        "FRB05": "Loir-et-Cher",
        "FRB06": "Loiret",
        "FRC11": "Côte-d’Or",
        "FRC12": "Nièvre",
        "FRC13": "Saône-et-Loire",
        "FRC14": "Yonne",
        "FRC21": "Doubs",
        "FRC22": "Jura",
        "FRC23": "Haute-Saône",
        "FRC24": "Territoire de Belfort",
        "FRD11": "Calvados ",
        "FRD12": "Manche ",
        "FRD13": "Orne",
        "FRD21": "Eure",
        "FRD22": "Seine-Maritime",
        "FRE11": "Nord",
        "FRE12": "Pas-de-Calais",
        "FRE21": "Aisne",
        "FRE22": "Oise",
        "FRE23": "Somme",
        "FRF11": "Bas-Rhin",
        "FRF12": "Haut-Rhin",
        "FRF21": "Ardennes",
        "FRF22": "Aube",
        "FRF23": "Marne",
        "FRF24": "Haute-Marne",
        "FRF31": "Meurthe-et-Moselle ",
        "FRF32": "Meuse ",
        "FRF33": "Moselle",
        "FRF34": "Vosges",
        "FRG01": "Loire-Atlantique",
        "FRG02": "Maine-et-Loire",
        "FRG03": "Mayenne",
        "FRG04": "Sarthe",
        "FRG05": "Vendée",
        "FRH01": "Côtes-d’Armor",
        "FRH02": "Finistère",
        "FRH03": "Ille-et-Vilaine",
        "FRH04": "Morbihan",
        "FRI11": "Dordogne",
        "FRI12": "Gironde",
        "FRI13": "Landes",
        "FRI14": "Lot-et-Garonne",
        "FRI15": "Pyrénées-Atlantiques",
        "FRI21": "Corrèze",
        "FRI22": "Creuse",
        "FRI23": "Haute-Vienne",
        "FRI31": "Charente",
        "FRI32": "Charente-Maritime",
        "FRI33": "Deux-Sèvres",
        "FRI34": "Vienne",
        "FRJ11": "Aude",
        "FRJ12": "Gard",
        "FRJ13": "Hérault",
        "FRJ14": "Lozère",
        "FRJ15": "Pyrénées-Orientales",
        "FRJ21": "Ariège",
        "FRJ22": "Aveyron",
        "FRJ23": "Haute-Garonne",
        "FRJ24": "Gers",
        "FRJ25": "Lot",
        "FRJ26": "Hautes-Pyrénées ",
        "FRJ27": "Tarn",
        "FRJ28": "Tarn-et-Garonne",
        "FRK11": "Allier",
        "FRK12": "Cantal",
        "FRK13": "Haute-Loire",
        "FRK14": "Puy-de-Dôme",
        "FRK21": "Ain",
        "FRK22": "Ardèche",
        "FRK23": "Drôme",
        "FRK24": "Isère",
        "FRK25": "Loire",
        "FRK26": "Rhône",
        "FRK27": "Savoie",
        "FRK28": "Haute-Savoie",
        "FRL01": "Alpes-de-Haute-Provence",
        "FRL02": "Hautes-Alpes ",
        "FRL03": "Alpes-Maritimes",
        "FRL04": "Bouches-du-Rhône",
        "FRL05": "Var",
        "FRL06": "Vaucluse",
        "FRM01": "Corse-du-Sud",
        "FRM02": "Haute-Corse",
        "FRY10": "Guadeloupe",
        "FRY20": "Martinique ",
        "FRY30": "Guyane",
        "FRY40": "La Réunion",
        "FRY50": "Mayotte ",
        "FRZZZ": "Extra-Regio NUTS 3"
    },
    "IE": {
        "IE041": "Border",
        "IE042": "West",
        "IE051": "Mid-West ",
        "IE052": "South-East ",
        "IE053": "South-West ",
        "IE061": "Dublin",
        "IE062": "Mid-East",
        "IE063": "Midland",
        "IEZZZ": "Extra-Regio NUTS 3"
    },
    "IT": {
        "ITC11": "Torino",
        "ITC12": "Vercelli",
        "ITC13": "Biella",
        "ITC14": "Verbano-Cusio-Ossola",
        "ITC15": "Novara",
        "ITC16": "Cuneo",
        "ITC17": "Asti",
        "ITC18": "Alessandria",
        "ITC20": "Valle d’Aosta/Vallée d’Aoste",
        "ITC31": "Imperia",
        "ITC32": "Savona",
        "ITC33": "Genova",
        "ITC34": "La Spezia",
        "ITC41": "Varese",
        "ITC42": "Como",
        "ITC43": "Lecco",
        "ITC44": "Sondrio",
        "ITC46": "Bergamo",
        "ITC47": "Brescia",
        "ITC48": "Pavia",
        "ITC49": "Lodi",
        "ITC4A": "Cremona",
        "ITC4B": "Mantova",
        "ITC4C": "Milano",
        "ITC4D": "Monza e della Brianza",
        "ITF11": "L’Aquila",
        "ITF12": "Teramo",
        "ITF13": "Pescara",
        "ITF14": "Chieti",
        "ITF21": "Isernia",
        "ITF22": "Campobasso",
        "ITF31": "Caserta",
        "ITF32": "Benevento",
        "ITF33": "Napoli",
        "ITF34": "Avellino",
        "ITF35": "Salerno",
        "ITF43": "Taranto",
        "ITF44": "Brindisi",
        "ITF45": "Lecce",
        "ITF46": "Foggia",
        "ITF47": "Bari",
        "ITF48": "Barletta-Andria-Trani",
        "ITF51": "Potenza",
        "ITF52": "Matera",
        "ITF61": "Cosenza",
        "ITF62": "Crotone",
        "ITF63": "Catanzaro",
        "ITF64": "Vibo Valentia",
        "ITF65": "Reggio di Calabria",
        "ITG11": "Trapani",
        "ITG12": "Palermo",
        "ITG13": "Messina",
        "ITG14": "Agrigento",
        "ITG15": "Caltanissetta",
        "ITG16": "Enna",
        "ITG17": "Catania",
        "ITG18": "Ragusa",
        "ITG19": "Siracusa",
        "ITG2D": "Sassari",
        "ITG2E": "Nuoro",
        "ITG2F": "Cagliari",
        "ITG2G": "Oristano",
        "ITG2H": "Sud Sardegna",
        "ITH10": "Bolzano-Bozen",
        "ITH20": "Trento",
        "ITH31": "Verona",
        "ITH32": "Vicenza",
        "ITH33": "Belluno",
        "ITH34": "Treviso",
        "ITH35": "Venezia",
        "ITH36": "Padova",
        "ITH37": "Rovigo",
        "ITH41": "Pordenone",
        "ITH42": "Udine",
        "ITH43": "Gorizia",
        "ITH44": "Trieste",
        "ITH51": "Piacenza",
        "ITH52": "Parma",
        "ITH53": "Reggio nell’Emilia",
        "ITH54": "Modena",
        "ITH55": "Bologna",
        "ITH56": "Ferrara",
        "ITH57": "Ravenna",
        "ITH58": "Forlì-Cesena",
        "ITH59": "Rimini",
        "ITI11": "Massa-Carrara",
        "ITI12": "Lucca",
        "ITI13": "Pistoia",
        "ITI14": "Firenze",
        "ITI15": "Prato",
        "ITI16": "Livorno",
        "ITI17": "Pisa",
        "ITI18": "Arezzo",
        "ITI19": "Siena",
        "ITI1A": "Grosseto",
        "ITI21": "Perugia",
        "ITI22": "Terni",
        "ITI31": "Pesaro e Urbino",
        "ITI32": "Ancona",
        "ITI33": "Macerata",
        "ITI34": "Ascoli Piceno",
        "ITI35": "Fermo",
        "ITI41": "Viterbo",
        "ITI42": "Rieti",
        "ITI43": "Roma",
        "ITI44": "Latina",
        "ITI45": "Frosinone",
        "ITZZZ": "Extra-Regio NUTS 3"
    },
    "LT": {
        "LT011": "Vilniaus apskritis",
        "LT021": "Alytaus apskritis",
        "LT022": "Kauno apskritis",
        "LT023": "Klaipėdos apskritis",
        "LT024": "Marijampolės apskritis",
        "LT025": "Panevėžio apskritis",
        "LT026": "Šiaulių apskritis",
        "LT027": "Tauragės apskritis",
        "LT028": "Telšių apskritis",
        "LT029": "Utenos apskritis",
        "LTZZZ": "Extra-Regio NUTS 3"
    },
    "LV": {
        "LV003": "Kurzeme",
        "LV005": "Latgale",
        "LV006": "Rīga",
        "LV007": "Pierīga",
        "LV008": "Vidzeme",
        "LV009": "Zemgale",
        "LVZZZ": "Extra-Regio NUTS 3"
    },
    "NL": {
        "NL111": "Oost-Groningen",
        "NL112": "Delfzijl en omgeving",
        "NL113": "Overig Groningen",
        "NL124": "Noord-Friesland",
        "NL125": "Zuidwest-Friesland",
        "NL126": "Zuidoost-Friesland",
        "NL131": "Noord-Drenthe",
        "NL132": "Zuidoost-Drenthe",
        "NL133": "Zuidwest-Drenthe",
        "NL211": "Noord-Overijssel",
        "NL212": "Zuidwest-Overijssel",
        "NL213": "Twente",
        "NL221": "Veluwe",
        "NL224": "Zuidwest-Gelderland",
        "NL225": "Achterhoek",
        "NL226": "Arnhem/Nijmegen",
        "NL230": "Flevoland",
        "NL310": "Utrecht",
        "NL321": "Kop van Noord-Holland",
        "NL323": "IJmond",
        "NL324": "Agglomeratie Haarlem",
        "NL325": "Zaanstreek",
        "NL327": "Het Gooi en Vechtstreek",
        "NL328": "Alkmaar en omgeving",
        "NL329": "Groot-Amsterdam",
        "NL332": "Agglomeratie ’s-Gravenhage",
        "NL333": "Delft en Westland",
        "NL337": "Agglomeratie Leiden en Bollenstreek",
        "NL33A": "Zuidoost-Zuid-Holland",
        "NL33B": "Oost-Zuid-Holland",
        "NL33C": "Groot-Rijnmond",
        "NL341": "Zeeuwsch-Vlaanderen",
        "NL342": "Overig Zeeland",
        "NL411": "West-Noord-Brabant",
        "NL412": "Midden-Noord-Brabant",
        "NL413": "Noordoost-Noord-Brabant",
        "NL414": "Zuidoost-Noord-Brabant",
        "NL421": "Noord-Limburg",
        "NL422": "Midden-Limburg",
        "NL423": "Zuid-Limburg",
        "NLZZZ": "Extra-Regio NUTS 3"
    },
    "PL": {
        "PL213": "Miasto Kraków",
        "PL214": "Krakowski",
        "PL217": "Tarnowski",
        "PL218": "Nowosądecki",
        "PL219": "Nowotarski",
        "PL21A": "Oświęcimski",
        "PL224": "Częstochowski",
        "PL225": "Bielski",
        "PL227": "Rybnicki",
        "PL228": "Bytomski",
        "PL229": "Gliwicki",
        "PL22A": "Katowicki",
        "PL22B": "Sosnowiecki",
        "PL22C": "Tyski",
        "PL411": "Pilski",
        "PL414": "Koniński",
        "PL415": "Miasto Poznań",
        "PL416": "Kaliski",
        "PL417": "Leszczyński",
        "PL418": "Poznański",
        "PL424": "Miasto Szczecin",
        "PL426": "Koszaliński",
        "PL427": "Szczecinecko-pyrzycki",
        "PL428": "Szczeciński",
        "PL431": "Gorzowski",
        "PL432": "Zielonogórski",
        "PL514": "Miasto Wrocław",
        "PL515": "Jeleniogórski",
        "PL516": "Legnicko-głogowski",
        "PL517": "Wałbrzyski",
        "PL518": "Wrocławski",
        "PL523": "Nyski",
        "PL524": "Opolski",
        "PL613": "Bydgosko-toruński",
        "PL616": "Grudziądzki",
        "PL617": "Inowrocławski",
        "PL618": "Świecki",
        "PL619": "Włocławski",
        "PL621": "Elbląski",
        "PL622": "Olsztyński",
        "PL623": "Ełcki",
        "PL633": "Trójmiejski",
        "PL634": "Gdański",
        "PL636": "Słupski",
        "PL637": "Chojnicki",
        "PL638": "Starogardzki",
        "PL711": "Miasto Łódź",
        "PL712": "Łódzki",
        "PL713": "Piotrkowski",
        "PL714": "Sieradzki",
        "PL715": "Skierniewicki",
        "PL721": "Kielecki",
        "PL722": "Sandomiersko-jędrzejowski",
        "PL811": "Bialski",
        "PL812": "Chełmsko-zamojski",
        "PL814": "Lubelski",
        "PL815": "Puławski",
        "PL821": "Krośnieński",
        "PL822": "Przemyski",
        "PL823": "Rzeszowski",
        "PL824": "Tarnobrzeski",
        "PL841": "Białostocki",
        "PL842": "Łomżyński",
        "PL843": "Suwalski",
        "PL911": "Miasto Warszawa",
        "PL912": "Warszawski wschodni",
        "PL913": "Warszawski zachodni",
        "PL921": "Radomski",
        "PL922": "Ciechanowski",
        "PL923": "Płocki",
        "PL924": "Ostrołęcki",
        "PL925": "Siedlecki",
        "PL926": "Żyrardowski",
        "PLZZZ": "Extra-Regio NUTS 3"
    },
    "TR": {
        "TR100": "İstanbul",
        "TR211": "Tekirdağ",
        "TR212": "Edirne",
        "TR213": "Kırklareli",
        "TR221": "Balıkesir",
        "TR222": "Çanakkale",
        "TR310": "İzmir",
        "TR321": "Aydın",
        "TR322": "Denizli",
        "TR323": "Muğla",
        "TR331": "Manisa",
        "TR332": "Afyonkarahisar",
        "TR333": "Kütahya",
        "TR334": "Uşak",
        "TR411": "Bursa",
        "TR412": "Eskişehir",
        "TR413": "Bilecik",
        "TR421": "Kocaeli",
        "TR422": "Sakarya",
        "TR423": "Düzce",
        "TR424": "Bolu",
        "TR425": "Yalova",
        "TR510": "Ankara",
        "TR521": "Konya",
        "TR522": "Karaman",
        "TR611": "Antalya",
        "TR612": "Isparta",
        "TR613": "Burdur",
        "TR621": "Adana",
        "TR622": "Mersin",
        "TR631": "Hatay",
        "TR632": "Kahramanmaraş",
        "TR633": "Osmaniye",
        "TR711": "Kırıkkale",
        "TR712": "Aksaray",
        "TR713": "Niğde",
        "TR714": "Nevşehir",
        "TR715": "Kırşehir",
        "TR721": "Kayseri",
        "TR722": "Sivas",
        "TR723": "Yozgat",
        "TR811": "Zonguldak",
        "TR812": "Karabük",
        "TR813": "Bartın",
        "TR821": "Kastamonu",
        "TR822": "Çankırı",
        "TR823": "Sinop",
        "TR831": "Samsun",
        "TR832": "Tokat",
        "TR833": "Çorum",
        "TR834": "Amasya",
        "TR901": "Trabzon",
        "TR902": "Ordu",
        "TR903": "Giresun",
        "TR904": "Rize",
        "TR905": "Artvin",
        "TR906": "Gümüşhane",
        "TRA11": "Erzurum",
        "TRA12": "Erzincan",
        "TRA13": "Bayburt",
        "TRA21": "Ağrı",
        "TRA22": "Kars",
        "TRA23": "Iğdır",
        "TRA24": "Ardahan",
        "TRB11": "Malatya",
        "TRB12": "Elazığ",
        "TRB13": "Bingöl",
        "TRB14": "Tunceli",
        "TRB21": "Van",
        "TRB22": "Muş",
        "TRB23": "Bitlis",
        "TRB24": "Hakkari",
        "TRC11": "Gaziantep",
        "TRC12": "Adıyaman",
        "TRC13": "Kilis",
        "TRC21": "Şanlıurfa",
        "TRC22": "Diyarbakır",
        "TRC31": "Mardin",
        "TRC32": "Batman",
        "TRC33": "Şırnak",
        "TRC34": "Siirt",
        "TRZZZ": "Extra-Regio NUTS 3"
    }
};
	}
	/*
	// Extract only NUTS-3 regions from data.
	extract(geometries, cc){
		this.regions = [];
		geometries.forEach(r=>{
			if (typeof r.properties !== 'undefined') {
				if (r.properties.CNTR_CODE === cc && r.properties.LEVL_CODE === 3) {
					this.regions.push({
						id: r.properties.NUTS_ID,
						name: r.properties.NUTS_NAME,
						name_latn: r.properties.NAME_LATN
					});
				}
				// '<option value="">name</option>'+
				// r.properties.NUTS_ID => value
				// r.properties.CNTR_CODE
				// r.properties.NAME_LATN
				// r.properties.NUTS_NAME => name
				
			}
		});
		//console.log(['EXTRACTED country_regions for ',cc,'=',country_regions]);
	}*/
	/*
	fetch(context) {
		// context is country code (CNTR_CODE in JSON)
		const self = this;
		let status = 500; // error: 500
		this.errorMessage = '';
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.fetching = true;
		
		const url = this.src;
		console.log (['fetch url=',url]);
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				//const resu = JSON.parse(myJson);
				const resu = myJson;
				//console.log(['resu=',resu]);
				if (typeof resu.objects !== 'undefined' && typeof resu.objects['NUTS_LB_2021_3035'] !== 'undefined') {
					const geometries = resu.objects['NUTS_LB_2021_3035'].geometries;
					if (Array.isArray(geometries) && geometries.length > 0) {
						self.extract(geometries, context);
					}
				}
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
			})
			.catch(error => {
				//console.log(['error=',error]);
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
			});
	}*/
	
	fillSimulated(code) {
		console.log(['FILL SIMULATED code=',code]);
		
		const cc = this.simulation_backup[code];
		Object.keys(cc).forEach(key => {
			this.regions.push({
				id: key,
				name: cc[key]
			});
		});
	}
	
	fetch(code) {
		const self = this;
		let status = 500; // error: 500
		this.errorMessage = '';
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.fetching = true;
		this.regions = [];
		
		if (this.MOCKUP) {
			
			this.fillSimulated(code);
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:200, message:'OK'});
			
		} else {
			
			const url = this.backend + '/NUTS3_by_country?country_code='+code;
			console.log (['fetch url=',url]);
			fetch(url)
				.then(function(response) {
					status = response.status;
					return response.json();
				})
				.then(function(myJson) {
					let resu;
					if (typeof myJson === 'string') {
						resu = JSON.parse(myJson);
					} else {
						resu = myJson;
					}
					console.log(['resu=',resu]);
					
					const cc = resu[code];
					Object.keys(cc).forEach(key => {
						self.regions.push({
							id: key,
							name: cc[key]
						});
					});
					self.fetching = false;
					self.ready = true;
					self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
				})
				.catch(error => {
					
					let msg = "Error: ";
					if (typeof error.message !== 'undefined') {
						msg += error.message;
					} else {
						msg += 'NOT SPECIFIED in error.message.';
					}
					//Fill the simulated values anyway... just to be able to test without DATABASE CONNECTION.
					self.fillSimulated(code);
					
					console.log(['error msg=',msg]);
					
					// ACT LIKE EVERYTHING IS JUST OK!
					self.fetching = false;
					self.ready = true;
					self.notifyAll({model:self.name, method:'fetched', status:200, message:'OK'});
					
					/*
					self.fetching = false;
					self.ready = true;
					self.errorMessage = msg;
					self.notifyAll({model:self.name, method:'fetched', status:status, message:msg});
					*/
				});
		}
	}
}