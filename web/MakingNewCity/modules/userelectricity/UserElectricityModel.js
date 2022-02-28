import Model from '../common/Model.js';
import CalculatedEnergy from '../common/CalculatedEnergy.js';
export default class UserElectricityModel extends Model {
	
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
		this.index = options.index;
		
		this.measurement = [];
		this.period = {start: undefined, end: undefined};
		this.energyValues = [];
		this.energyTotal = 0;
	}
	/*
		Note: IT TAKES time to fecth electricity values (totalEnergy), even if we are fetching 
		only one value from short period of time.
		
		2022-02-25:
		
		https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=energy&limit=1&start=2022-02-23T23:50&end=2022-02-24T00:00
		...
		https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=energy&limit=1&start=2022-01-25T23:50&end=2022-01-26T00:00
	*/
	setTimePeriod() {
		const d = this.index+1;
		const e_m = moment().subtract(d,'days');
		// Snap end to this current full hour.
		e_m.hours(0);
		e_m.minutes(0);
		e_m.seconds(0);
		const s_m = moment(e_m).subtract(10, 'minutes'); // get latest value between end-10m ... end
		this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
		this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
		
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
	
	process(myJson) {
		const self = this;
		if (this.type === 'energy') {
			
			self.energyValues = [];
			
			const newson = this.removePowerDuplicates(myJson);
			
			const myce = new CalculatedEnergy();
			myce.resetEnergyHours(this.timerange*24);
			//console.log(['myce.energy=',myce.energy]);
			$.each(newson, function(i,v){
				// set cumulative energy for each hour.
				myce.addEnergy(v);
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
						console.log(['self.measurement=',myJson]);
					} else {
						console.log(['Before process() myJson=',myJson]);
						//self.process(myJson);
					}
					
				} else {
					if (myJson === 'No data!') {
						self.status = 404;
						message = self.name+': '+myJson;
						self.errorMessage = message;
						self.measurement = [];
						
					} else if (myJson === 'Err:PROTOCOL_SEQUENCE_TIMEOUT') {
						
						console.log('Err:PROTOCOL_SEQUENCE_TIMEOUT  !!!!!!!!!!!!!!!!!!?');
						
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
				//console.log(['self.measurement=',self.measurement]);
				//console.log([self.name+' fetch status=',self.status]);
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
