
class EventObserver {
	constructor() {
		this.observers = [];
	}
	subscribe(fn) {
		this.observers.push(fn);
	}
	unsubscribe(fn) {
		this.observers = this.observers.filter((subscriber) => subscriber !== fn);
	}
	notifyAll(options) {
		this.observers.forEach((subscriber) => subscriber.notify(options));
	}
}

class MapModel {
	constructor(obj) {
		this.title     = obj.title;
		this.picture   = obj.picture;
		this.latitude  = obj.latitude;
		this.longitude = obj.longitude;
		this.startDate = obj.startDate;
		this.endDate   = obj.endDate;
	}
}

class MapListModel extends EventObserver {
	
	constructor() {
		super();
		this.mapdata = {};
	}
	
	getMapData() {
		return this.mapdata;
	}
	
	fetch() {
		var self = this;
		var status = 200;
		var message = 'OK';
		self.mapdata = {};
		
		self.mapdata["2013 Faliraki, Rhodes"] = new MapModel({
			title: 'Epsilon',
			picture: 'img/Epsilon.jpg',
			latitude:  36.3576,
			longitude: 28.2107,
			startDate: '30.06.2013',
			endDate:  '07.07.2013'
		});
		self.mapdata["2014 Hania, Crete"] = new MapModel({
			title: 'Maleme Imperial',
			picture: 'img/MalemeImperial.jpg',
			latitude:  35.5254,
			longitude: 23.8438,
			startDate: '27.06.2014',
			endDate:  '11.07.2014'
		});
		self.mapdata["2015 Agios Nicolaos, Crete"] = new MapModel({
			title: 'Candia Park Village',
			picture: 'img/CandiaParkVillage.jpg',
			latitude:  35.2181,
			longitude: 25.7121,
			startDate: '26.06.2015',
			endDate:  '10.07.2015'
		});
		self.mapdata["2016 Zakynthos"] = new MapModel({
			title: 'Windmill Bay',
			picture: 'img/WindmillBay.jpg',
			latitude:  37.7617,
			longitude: 20.9319,
			startDate: '27.06.2016',
			endDate:  '11.07.2016'
		});
		self.mapdata["2017 Lefkada"] = new MapModel({
			title: 'Porto Galini',
			picture: 'img/PortoGalini.jpg',
			latitude:  38.7366,
			longitude: 20.7309,
			startDate: '27.06.2017',
			endDate:  '11.07.2017'
		});
		self.mapdata["2017 Playa del Ingles, Gran Canaria"] = new MapModel({
			title: 'Palm Oasis',
			picture: 'img/PalmOasis.jpg',
			latitude:  27.76405,
			longitude: -15.5995,
			startDate: '22.12.2017',
			endDate:  '29.12.2017'
		});
		self.mapdata["2018 Lesvos"] = new MapModel({
			title: 'Anaxos Hill',
			picture: 'img/AnaxosHill.jpg',
			latitude:  39.3218,
			longitude: 26.1505,
			startDate: '27.06.2018',
			endDate:  '11.07.2018'
		});
		self.mapdata["2018 Agii Apostoli, Hania, Crete"] = new MapModel({
			title: 'Stellina Village Resort',
			picture: 'img/StellinaVillageResort.jpg',
			latitude:  35.5106,
			longitude: 23.9883,
			startDate: '13.10.2018',
			endDate:  '20.10.2018'
		});
		self.mapdata["2018 Playa de las Americas, Tenerife"] = new MapModel({
			title: 'Marola Portosin',
			picture: 'img/MarolaPortosin.jpg',
			latitude:  28.0570,
			longitude: -16.7231,
			startDate: '27.12.2018',
			endDate:  '04.01.2019'
		});
		
		self.mapdata["2019 Funchal, Madeira"] = new MapModel({
			title: 'Eden Mar',
			picture: 'img/EdenMar.jpg',
			latitude:  32.6375,
			longitude: -16.9314,
			startDate: '01.07.2019',
			endDate:  '15.07.2019'
		});
		self.mapdata["2019 Porto, Portugal"] = new MapModel({
			title: 'Belomont6 Apartments',
			picture: 'img/Belomont6.jpg',
			latitude:  41.1428,
			longitude: -8.6155,
			startDate: '12.10.2019',
			endDate:  '19.10.2019'
		});
		self.mapdata["2019 Puerto de la Cruz, Tenerife"] = new MapModel({
			title: 'Casablanca',
			picture: 'img/Casablanca.jpg',
			latitude:  28.4139,
			longitude: -16.5432,
			startDate: '27.12.2019',
			endDate:  '03.01.2020'
		});
		self.mapdata["2023 Budapest, Hungary"] = new MapModel({
			title: "Vagabond Grand'Or",
			picture: 'img/vagabond-d-or.jpg',
			latitude:  47.49742,
			longitude: 19.06490,
			startDate: '03.07.2023',
			endDate:  '07.07.2023'
		});
		self.mapdata["2023 Funchal, Madeira"] = new MapModel({
			title: 'Alto Lido',
			picture: 'img/altolido.jpg',
			latitude:  32.6384,
			longitude: -16.9360,
			startDate: '25.12.2023',
			endDate:  '01.01.2024'
		});
		self.mapdata["2024 Riga, Latvia"] = new MapModel({
			title: 'Grand Poet by Semarah',
			picture: 'img/GrandPoet.jpg',
			latitude:  56.95370,
			longitude: 24.11048,
			startDate: '03.05.2024',
			endDate:  '05.05.2024'
		});
		self.mapdata["2024 Lisbon, Portugal"] = new MapModel({
			title: 'Rua Maria Pia',
			picture: 'img/RuaMariaPia.jpg',
			latitude:  38.70824,
			longitude: -9.17201,
			startDate: '08.07.2024',
			endDate:  '15.07.2024'
		});
		self.mapdata["2024 Edinburgh, Scotland"] = new MapModel({
			title: 'The Haymarket Hotel', //55°56'46"N 3°13'18"W
			picture: 'img/EdinburghHaymarketHotel.jpg',
			latitude:  55.9462, // 55 + 56/60 + 46/3600 = 55 + 0,9333 + 0,012777
			longitude: -3.2217, // 3 + 13/60 + 18/3600 = 3 + 0,216666  + 0,005
			startDate: '12.12.2024',
			endDate:  '15.12.2024'
		});
		self.mapdata["2024 Playa del Ingles, Gran Canaria"] = new MapModel({
			title: 'Palm Oasis',
			picture: 'img/PalmOasis.jpg',
			latitude:  27.7643,//27.7646,
			longitude: -15.5997,//-15.5990,
			startDate: '28.12.2024',
			endDate:  '04.01.2025'
		});
		/*
		self.mapdata["2020 Budapest, Hungary"] = new MapModel({
			title: 'Corvin Center Suites',
			picture: 'img/Casablanca.jpg',
			latitude:  47.47,
			longitude: 19.07,
			startDate: '26.03.2020',
			endDate:  '29.03.2020'
		});
		self.mapdata["2020 London, England"] = new MapModel({
			title: 'Okehampton Road',
			picture: 'img/Casablanca.jpg',
			latitude:  51.538077,
			longitude: -0.220512,
			startDate: '29.06.2020',
			endDate:  '07.07.2020'
		});
		*/
		self.notifyAll({model:'MapListModel',method:'fetch',status:status,message:message});
	}
}
