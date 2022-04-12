import Model from '../common/Model.js';
export default class NewUserElectricityModel extends Model {
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	*/
	
	/*
	
	NEW:
	Use URL:
		https://makingcity.vtt.fi/data/sivakka/apartments/feeds.json?apiKey=12E6F2B1236A&type=energy&start=2022-04-07T00:00&end=2022-04-08T00:00
	
	Fetch one day at a time. It contains 1 minute interval => 1440 values per day.
	Current day has only values so far.
	
	If today is 8.4.2022
	when index = 0 => start=2022-04-07T00:00&end=2022-04-08T00:00
	when index = 1 => start=2022-04-06T00:00&end=2022-04-07T00:00
	...
	Response is like this:
	...
	[
	{"created_at":"2022-04-07T00:26:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":720,"totalEnergy":20871.153,"impulseLastCtr":12,"impulseTotalCtr":20871153},
	{"created_at":"2022-04-07T00:27:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":660,"totalEnergy":20871.164,"impulseLastCtr":11,"impulseTotalCtr":20871164},
	{"created_at":"2022-04-07T00:28:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":720,"totalEnergy":20871.176,"impulseLastCtr":12,"impulseTotalCtr":20871176},
	{"created_at":"2022-04-07T00:29:35","residentId":1,"apartmentId":101,"meterId":1001,"averagePower":660,"totalEnergy":20871.187,"impulseLastCtr":11,"impulseTotalCtr":20871187},
	...
	]
	Extract:
		created_at
		averagePower
		totalEnergy
	*/
	constructor(options) {
		
		super(options);
		this.type = options.type;
		this.limit = options.limit;
		this.index = options.index;
		// this.period is calculated dynamically before fetching (see setTimePeriod())
		// but this model has quite static data values for one day. Except current day, which will be appended with new values once a minute.
		// So we can minimize traffic and netload by using this information:
		// 
		// if this.period.start starts with same 'YYYY-MM-DD' => we have already fetched this data.
		
		this.period = {start: undefined, end: undefined};
		this.dateYYYYMMDD = moment().subtract(this.index, 'days').format('YYYY-MM-DD');
		this.values = [];
		// These hashes contain DAILY and HOURLY averages in keys like YYYYMMDDHH and YYYYMMDD.
		// ALL values are 
		this.power = {};
		this.energy_day = {}; //   { date: ..., value: ... }
		this.energy_hours = []; // { date: ..., value: ... }
	}
	
	/*
		NOTE: Each day has its own model.
		There is 'UserElectricity0Model', 'UserElectricity1Model', 'UserElectricity2Model', ...
		where index is the same number as in models name.
		index	fetch
		0		start=2022-04-08T00:00&end=2022-04-08T12:34
		1		start=2022-04-07T00:00&end=2022-04-08T00:00
		2		start=2022-04-06T00:00&end=2022-04-07T00:00
		...
	*/
	
	setTimePeriod() {
		const i = this.index;
		if (i === 0) {
			// if current day, fetch always from start of current day, for example:
			// start=2022-04-08T00:00&end=2022-04-08T12:34
			const e_m = moment();
			const s_m = moment();
			s_m.hours(0);
			s_m.minutes(0);
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
			
		} else {
			// if not the current day, fetch always full day, for example:
			// start=2022-04-07T00:00&end=2022-04-08T00:00
			const ei = i-1;
			const si = i;
			const e_m = moment().subtract(ei, 'days');
			// Make dates start at midnight and end at midnight.
			e_m.hours(0);
			e_m.minutes(0);
			const s_m = moment(e_m).subtract(1, 'days');
			this.period.start = s_m.format('YYYY-MM-DDTHH:mm');
			this.period.end = e_m.format('YYYY-MM-DDTHH:mm');
		}
	}
	/*
		Three cases where fetching is needed:
		1. this.index === 0
		2. this.values.length === 0
		3. if this.dateYYYYMMDD !== moment().subtract(this.index, 'days').format('YYYY-MM-DD')
		
		Third is to check that the initial date for this model is still valid.
	*/
	needToFetch() {
		let retval = false;
		if (this.index === 0 || this.values.length === 0) {
			retval = true;
		}
		// Third check is done separately because it should be done anyway to reset initial value, if needed.
		const nowYYYYMMDD = moment().subtract(this.index, 'days').format('YYYY-MM-DD');
		if (this.dateYYYYMMDD !== nowYYYYMMDD) {
			retval = true;
			this.dateYYYYMMDD = nowYYYYMMDD;
		}
		return retval;
	}
	
	processValues() {
		const temp_a = [];
		
		const vals = this.values;
		if (Array.isArray(vals) && vals.length > 0) {
			vals.forEach(v=>{
				const d = new Date(v.created_at);
				const ap = v.averagePower;
				const tot = v.totalEnergy;
				temp_a.push({date:d, power:ap, energy:tot});
			});
		}
		const len = temp_a.length;
		if (len > 1) {
			// Then sort array based according to date, oldest entry first.
			temp_a.sort(function(a,b){
				var bb = moment(b.date);
				var aa = moment(a.date);
				return aa - bb;
			});
			
			//this.power = {};
			// total energy for different timeranges.
			this.energy_hours = []; // {date: nnnn, value: xxx}
			
			const modelDate = moment(this.dateYYYYMMDD+'T12:00').toDate();
			this.energy_day = { date: modelDate, value: temp_a[len-1].energy - temp_a[0].energy };
			
			
			
			// Energy 30 days (30 day values), 7 days (168 hour values), current day (up to 1440 values)
			// Power 30 days (30 day values), 7 days (168 hour values), current day (up to 1440 values)
			
			
			/*
			What calculated values we should have available for each day?
			
			1. Energy used in day.
			2. Energy used in each hour of the day.
			2. Energy used in each minute of each hour.
			
			
			
			
			
			this.energy_day - energy consumed in day
			this.energy_hours - energy consumed in each hour of the day
			this.power - averages (minute data day: 1440), 1 hour (60),  hourly averages (24)
			
			*/
			
			/*
			// initialize power HOURLY averages:
			// this.power[YYYYMMDDHH] = {sum:0, count:0, average:0};
			// Initialize energy HOURLY averages:
			// this.energy[YYYYMMDD]['hour'][HH] = undefined;
			*/
			let energy_hh = {};
			
			for (let i=0; i<24; i++) { // from '0' to '23'
				let HH = (i<10) ? '0'+i : ''+i;
				const dd = moment(this.dateYYYYMMDD+'T'+HH).toDate();
				//this.power[HH] = {sum:0, count:0, average:0};
				energy_hh[HH] = {date:dd, value:undefined};
			}
			
			let temp_first = 0;
			let temp_last = 0;
			
			for (let i=0; i<len-1; i++) {
				const d = temp_a[i].date;
				//const p = temp_a[i].power;
				const e = temp_a[i].energy;
				
				// Add to hourly hash:
				const HH = moment(d).format('HH');
				if (typeof energy_hh[HH].value === 'undefined') {
					// This is the first value for this HH
					temp_first = e;
					temp_last = e;
					energy_hh[HH].value = 0;
				} else {
					temp_last = e;
					energy_hh[HH].value = temp_last - temp_first;
				}
				//this.power[HH]['count']++;
				//this.power[HH]['sum'] += p;
			}
			for (let i=0; i<24; i++) { // from '00' to '23'
				let HH = (i<10) ? '0'+i : ''+i;
				// If value was not defined => set it to zero.
				if (typeof energy_hh[HH].value === 'undefined') {
					energy_hh[HH].value = 0;
				}
				this.energy_hours.push(energy_hh[HH]);
			}
			// Calculate averages:
			// For daily and for hourly:
			/*Object.keys(this.power).forEach(key => {
				if (this.power[key]['sum'] > 0) {
					this.power[key]['average'] = this.power[key]['sum'] / this.power[key]['count'];
				}
			});
			*/
			
			
			// Print out the hashes:
			/*
			Object.keys(this.power).forEach(key => {
				console.log(['POWER key=',key,' value=',this.power[key]]);
			});
			Object.keys(this.energy).forEach(key => {
				console.log(['ENERGY key=',key,' value=',this.energy[key]]);
			});
			*/
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
				const resu = JSON.parse(myJson);
				if (Array.isArray(resu)) {
					
					self.values = resu;
					console.log(['self.values=',self.values]);
					
					// No need to process, if we fetch only limited set (1 value).
					if (self.limit === 0) {
						console.log('PROCESS VALUES');
						self.processValues();
					}
					
					
				} else {
					// If the response is NOT array => something went wrong. 
					console.log(['myJson=',myJson]);
					console.log(['resu=',resu]);
					
					if (myJson === 'No data!') {
						self.status = 404;
						message = self.name+': '+myJson;
						self.errorMessage = message;
						self.values = [];
						
					} else if (myJson === 'Err:PROTOCOL_SEQUENCE_TIMEOUT') {
						console.log('Err:PROTOCOL_SEQUENCE_TIMEOUT  !!!!!!!!!!!!!!!!!!?');
						self.status = 404;
						message = self.name+': '+myJson;
						self.errorMessage = message;
						self.values = [];
						
					} else if (typeof self.values.message !== 'undefined') {
						message = self.values.message;
						self.errorMessage = message;
						self.values = [];
						
					} else {
						self.values = [];
					}
				}
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message, index:self.index});
			})
			.catch(error => {
				console.log([self.name+' fetch error=',error]);
				self.fetching = false;
				self.ready = true;
				const message = self.name+': '+error;
				self.errorMessage = message;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message, index:self.index});
			});
	}
	
	fetch(token, readkey) {
		// If already fetching, no need to start again.
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		// Check if we already have valid values for this model.
		if (this.needToFetch()===false) {
			console.log('MODEL '+this.name+' NO NEED TO FETCH NOW!');
			// NOTE: We must return 'fetched' notification for sequential fetcher to proceed to next model.
			// Also set status 204 (No Content), so that we don't have to do unnecessary processing.
			this.notifyAll({model:this.name, method:'fetched', status:204, message:'', index:this.index});
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
				//const url = this.mongoBackend + '/apartments/feeds/';
				// this.src = 'data/sivakka/apartments/feeds.json' 
				const url = this.mongoBackend + '/proxes/apafeeds';
				const body_url = this.backend + '/' + this.src;
				const data = {
					url:body_url,
					readkey:readkey,
					type: this.type,
					limit:this.limit,
					start: start_date,
					end: end_date,
					expiration_in_seconds: 3600 // 60x60 = 1 hour.
				};
				const myPost = {
					method: 'POST',
					headers: myHeaders,
					body: JSON.stringify(data)
				};
				const myRequest = new Request(url, myPost);
				this.doTheFetch(myRequest);
				
			} else {
				// No readkey? Forbidden (403).
				this.status = 403;
				this.fetching = false;
				this.ready = true;
				const message = this.name+': Forbidden';
				this.errorMessage = message;
				this.notifyAll({model:this.name, method:'fetched', status:this.status, message:message, index:this.index});
			}
			
		} else {
			// No token? Authentication failed (401).
			this.status = 401;
			this.fetching = false;
			this.ready = true;
			const message = this.name+': Auth failed';
			this.errorMessage = message;
			this.notifyAll({model:this.name, method:'fetched', status:this.status, message:message, index:this.index});
		}
	}
}
