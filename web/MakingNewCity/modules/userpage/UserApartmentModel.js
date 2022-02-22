import Model from '../common/Model.js';
import CalculatedEnergy from '../common/CalculatedEnergy.js';
import CalculatedWater from '../common/CalculatedWater.js';
import CalculatedHeating from '../common/CalculatedHeating.js';

export class ApaFeed {
	constructor(obj) {
		this.time = new Date(obj.created_at); // "2020-02-10T00:01:06"
		this.meterId = obj.meterId; // Number
		this.averagePower = obj.averagePower; // Float
		this.totalEnergy = obj.totalEnergy; // Float
		this.coldTotal = obj.coldTotal; // Float
		this.hotTotal = obj.hotTotal; // Float
	}
}

export default class UserApartmentModel extends Model {
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	*/
	
	/*
	
	Todo: 
	When we process response with more than one measurement, we must form result per hour (YYYYMMDDHH) => approx. 60 measurements 
	are summed into object with timestamp as a key (like in FeedModel).
	this.energy[YYYYMMDDHH] = {};
	
	IN FeedModel we have:
		[
		
		{"created_at":"2020-10-26T00:00:45","meterId":116,"averagePower":0,"totalEnergy":50932.2,"energyDiff":0},
		{"created_at":"2020-10-26T00:01:42","meterId":116,"averagePower":0,"totalEnergy":50932.2,"energyDiff":0},
		{"created_at":"2020-10-26T00:02:43","meterId":116,"averagePower":0,"totalEnergy":50932.2,"energyDiff":0},
		...
		
	IN ApartmentModel:
	{"created_at": "2020-10-20T03:21:38","apartmentId":101,"averagePower":2040,"impulseLastCtr": 34,"​​​​​impulseTotalCtr": 585464,"​​​​​meterId": 1001,"​​​​​residentId": 1,"​​​​​totalEnergy": 585.464}
	
	
	
	Another case is when we need DAILY consumption data. This applies to electricity and water, where we need to fetch 
	total consumptions at the beginning and at the end of each day.
	This also is different to those which go back 24 hours (or one week, or one month) from current time.
	But we have the limit=1 here also, which makes this easier. And we should keep already fetched daily values in memory. They don't change.
	This is a new "category", data is not needed to fetch periodically. Fetch ONCE case.
	
	about:config
	devtools.netmonitor.responseBodyLimit is equal to 0.
	
	
	*/
	constructor(options) {
		
		super(options);
		
		this.type = options.type;
		this.limit = options.limit;
		this.range = options.range;
		// In the old implementation we had always end NOW and START was adjusted to be 
		// todays (00:00)    timerange 1
		// yesterdays 00:00  timerange 2
		// etc.
		// 
		// Now we need to define END-POINT to somewhere not always NOW-moment. And then the START-POINT to create period.
		// After that timerange just moves the startpoint further past but with 24 hour steps.
		// 
		/*
		if (typeof options.timerange !== 'undefined') {
			this.timerange = options.timerange;
		} else {
			this.timerange = undefined;
		}
		*/
		if (typeof options.timerange !== 'undefined') {
			this.timerange = options.timerange;
		} else {
			this.timerange = 1; // User can change this from 1 ... 7.
		}
		
		this.measurement = [];
		this.period = {start: undefined, end: undefined};
		this.values = [];
		//this.test_values = [];
		this.energyValues = [];
		this.energyTotal = 0;
		this.waterValues = [];
		this.waterMinMax = {
			hotmin: 0,
			hotmax: 0,
			coldmin: 0,
			coldmax: 0
		};
	}
	
	setTimePeriod() {
		const e_v = this.range.ends.value;
		const e_u = this.range.ends.unit;
		let s_v;
		let s_u;
		// NOTE: In charts we don't restrict number of values in response => we
		// use timerange to specify how many days to include in database query.
		if (this.limit === 0) {
			s_v = this.timerange;
			s_u = 'days';
			const e_m = moment().subtract(e_v, e_u);
			// Snap end to this current full hour.
			e_m.minutes(0);
			e_m.seconds(0);
			// ... it automatically snaps start to full hour of yesterday or day before that or ...
			// which makes it different than calls to get only one value (limit==1).
			const s_m = moment(e_m).subtract(s_v, s_u);
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
			
		} else {
			s_v = this.range.starts.value;
			s_u = this.range.starts.unit;
			
			const e_m = moment().subtract(e_v, e_u);
			// Do NOT snap end to current full hour, instead use current REAL-TIME!
			//e_m.minutes(0);
			//e_m.seconds(0);
			const s_m = moment(e_m).subtract(s_v, s_u);
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
		}
	}
	
	removePowerDuplicates(json) {
		// Check if there are timestamp duplicates?
		// And remove those with averagePower=0 at the same time.
		const test = {};
		const newJson = [];
		json.forEach(item => {
			const datetime = item.created_at;
			if (test.hasOwnProperty(datetime)) {
				//console.log(['DUPLICATE!!!!!! datetime=',datetime,' averagePower=',item.averagePower]);
				if (test[datetime].averagePower === 0 && item.averagePower > 0) {
					// Replacing duplicate ONLY if old value was zero and new value is NOT zero!
					console.log('REPLACE DUPLICATE (OLD WAS ZERO VALUE)!!!');
					test[datetime] = item;
				}
			} else {
				test[datetime] = item;
				newJson.push(item);
			}
		});
		return newJson;
	}
	
	removeWaterDuplicates(json) {
		// Check if there are timestamp duplicates?
		const test = {};
		const newJson = [];
		json.forEach(item => {
			const datetime = item.created_at;
			if (test.hasOwnProperty(datetime)) {
				console.log(['DUPLICATE IGNORED! datetime=',datetime,' hotTotal=',item.hotTotal,' coldTotal=',item.coldTotal]);
			} else {
				test[datetime] = item;
				newJson.push(item);
			}
		});
		return newJson;
	}
	
	removeHeatingDuplicates(json) {
		// Check if there are timestamp duplicates?
		const test = {};
		const newJson = [];
		json.forEach(item => {
			const datetime = item.created_at;
			if (test.hasOwnProperty(datetime)) {
				console.log(['DUPLICATE IGNORED! datetime=',datetime]);
			} else {
				test[datetime] = item;
				newJson.push(item);
			}
		});
		return newJson;
	}
	
	process(myJson) {
		const self = this;
		if (this.type === 'energy') {
			
			self.values = []; // Start with fresh empty data.
			self.energyValues = [];
			
			const newson = this.removePowerDuplicates(myJson);
			
			const myce = new CalculatedEnergy();
			myce.resetEnergyHours(this.timerange*24);
			//console.log(['myce.energy=',myce.energy]);
			$.each(newson, function(i,v){
				// set cumulative energy for each hour.
				myce.addEnergy(v);
				//const p = new ApaFeed(v);
				//self.values.push(p);
			});
			myce.calculateAverage(); 
			myce.copyTo(self.energyValues);
			// Then sort array based according to time, oldest entry first.
			self.energyValues.sort(function(a,b){
				var bb = moment(b.time);
				var aa = moment(a.time);
				return aa - bb;
			});
			self.energyValues.forEach(val => {
				val.energy = val.energy/1000;
			});
			self.energyTotal = myce.getTotal();
			
		} else if (this.type === 'water') {
			self.values = []; // Start with fresh empty data.
			self.waterValues = [];
			const newson = this.removeWaterDuplicates(myJson);
			
			const mycw = new CalculatedWater();
			mycw.resetWaterHours(this.timerange*24);
			
			$.each(newson, function(i,v){
				// set min and max values for hot and cold water for each hour.
				mycw.addWater(v);
				//const p = new ApaFeed(v);
				//self.values.push(p);
			});
			
			self.waterMinMax.hotmin = mycw.minmax.hotmin;
			self.waterMinMax.hotmax = mycw.minmax.hotmax;
			self.waterMinMax.coldmin = mycw.minmax.coldmin;
			self.waterMinMax.coldmax = mycw.minmax.coldmax;
			
			//mycw.printWater();
			mycw.copyTo(self.waterValues);
			// Then sort array based according to time, oldest entry first.
			self.waterValues.sort(function(a,b){
				var bb = moment(b.time);
				var aa = moment(a.time);
				return aa - bb;
			});
			
		} else {
			// type = sensor (Temperature and Humidity)
			self.values = []; // Start with fresh empty data.
			const newson = this.removeHeatingDuplicates(myJson);
			console.log(['SENSOR (Temperature and Humidity) newson=',newson]);
			/*
				humidity: 37.7
				meterId: 201​​​​
				residentId: 1
				temperature: 22.8
			*/
			const mych = new CalculatedHeating();
			mych.resetHours(this.timerange*24);
			
			$.each(newson, function(i,v){
				// set cumulative energy for each hour.
				mych.addMeasurement(v);
				//const p = new ApaFeed(v);
				//self.values.push(p);
			});
			mych.calculateAverage();
			//mych.copyTo(self.test_values);
			mych.copyTo(self.values);
			// Then sort array based according to time, oldest entry first.
			//self.test_values.sort(function(a,b){
			self.values.sort(function(a,b){
				var bb = moment(b.time);
				var aa = moment(a.time);
				return aa - bb;
			});
			
			// 30 x 24 = 720 = Hourly values for temperature and humidity
			// Object { time: Date Mon Feb 21 2022 13:00:00 GMT+0200 (Eastern European Standard Time), temperature: 23.281666666666673, humidity: 32.13333333333333 }
			console.log(['Heating values = ',self.values]);
			
			// NOW we copy ONLY selected set.
			/*let count = self.test_values.length;
			let foo = 24;
			self.test_values.forEach(m => {
				if (count <= foo) {
					self.values.push(m);
				}
				count--;
			});*/
		}
	}
	
	doTheFetch(url) {
		const self = this;
		
		fetch(url)
			.then(function(response) {
				self.status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				let message = 'OK';
				if (Array.isArray(myJson)) {
					
					if (myJson.length === 1) {
						self.measurement = myJson;
					} else {
						console.log(['Before process() myJson=',myJson]);
						self.process(myJson);
					}
					
				} else {
					if (myJson === 'No data!') {
						self.status = 404;
						message = self.name+': '+myJson;
						self.errorMessage = message;
						self.measurement = [];
					} else if (typeof self.measurement.message !== 'undefined') {
						message = self.measurement.message;
						self.errorMessage = message;
						self.measurement = [];
					} else {
						self.measurement = [];
					}
				}
				console.log(['self.measurement=',self.measurement]);
				console.log([self.name+' fetch status=',self.status]);
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			})
			.catch(error => {
				console.log([self.name+' fetch error=',error]);
				self.fetching = false;
				self.ready = true;
				const message = self.name+': '+error;
				self.errorMessage = message;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
			});
	}
	
	/*
		fetch_d
		Calls directly from src using backend (NOT mongoBackend).
	*/
	fetch_d() {
		const self = this;
		
		// this.src = 'data/sivakka/apartments/feeds.json'   
		//      must append: ?apiKey=12E6F2B1236A&type=type&limit=limit&start=2020-10-12T09:00&end=2020-10-12T10:00'
		// Use FAKE key now: '12E6F2B1236A'
		const fakeKey = '12E6F2B1236A';
		const start_date = this.period.start;
		const end_date = this.period.end;
		
		let url = this.backend + '/' + this.src + '?apiKey='+fakeKey+'&type='+this.type;
		if (this.limit > 0) {
			url += '&limit='+this.limit;
		}
		url += '&start='+start_date+'&end='+end_date;
		this.doTheFetch(url);
	}
	
	fetch(token, readkey) {
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		// Always start with setting the TIME PERIOD!
		this.setTimePeriod();
		this.status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		const start_date = this.period.start;
		const end_date = this.period.end;
		
		if (typeof token !== 'undefined') {
			var myHeaders = new Headers();
			var authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			myHeaders.append("Content-Type", "application/json");
			
			if (typeof readkey !== 'undefined') {
				// Normal user has a readkey, which was created when user registered into the system. 
				const url = this.mongoBackend + '/apartments/feeds/';
				
				// this.src = 'data/sivakka/apartments/feeds.json' 
				const body_url = this.backend + '/' + this.src;
				const data = {url:body_url, readkey:readkey, type: this.type, limit:this.limit, start: start_date, end: end_date };
				
				const myPost = {
					method: 'POST',
					headers: myHeaders,
					body: JSON.stringify(data)
				};
				const myRequest = new Request(url, myPost);
				this.doTheFetch(myRequest);
				//this.doTheFetch(url, myPost);
				
			} else {
				// Abnormal user (admin) => no readkey. Use direct url for testing purposes.
				this.fetch_d();
			}
			
		} else {
			// No token? Authentication failed (401).
			this.status = 401;
			this.fetching = false;
			this.ready = true;
			const message = this.name+': Auth failed';
			this.errorMessage = message;
			this.notifyAll({model:this.name, method:'fetched', status:this.status, message:message});
		}
	}
}
