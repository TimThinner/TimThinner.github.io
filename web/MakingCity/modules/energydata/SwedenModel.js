import Model from '../common/Model.js';

export default class SwedenModel extends Model {
	
	constructor(options) {
		super(options);
		 /*
			Model has:
				this.name = options.name;
				this.src = options.src;
				this.ready = false;
				this.errorMessage = '';
				this.status = 500;
				this.fetching = false;
		*/
		//this.value = undefined;
		this.values = [];
		//this.start_time = undefined;
		//this.end_time = undefined;
	}
	
	fetch(token) {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		var myHeaders = new Headers();
		var authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/json");
		
		const url = this.mongoBackend + '/proxes/sweden';
		const body_url = this.src;
		//const body_production_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
		const body_production_date = moment().format('YYYY-MM-DD');
		// req.body.url					https://www.svk.se/ControlRoom/GetProductionHistory/
		// req.body.production_date		YYYY-MM-DD
		//let url = req.body.url + '?productionDate=' + req.body.production_date + '&countryCode=SE';
		
		const data = {
			url: body_url,
			production_date: body_production_date,
			expiration_in_seconds: 180
		};
		const myPost = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		const myRequest = new Request(url, myPost);
		
		fetch(myRequest)
			.then(function(response) {
				self.status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				let message = 'OK';
				//console.log(['myJson=',myJson]);
/*
[
  {
    "name": 1,
    "sortorder": 1,
    "data": [
      {
        "x": 1590271260000,
        "y": 14343
      },
      {
        "x": 1590357480000,
        "y": 12015
      }
    ]
  }
]
'production', ...
'nuclear', ...
'thermal', ...
'unknown', ...
'wind', ...
'hydro', ...
'consumption'
*/
				self.values = [];
				const json = JSON.parse(myJson);
				if (typeof json !== 'undefined' && Array.isArray(json)) {
					json.forEach(r=>{
						// 7 x 1422 elements => print to console only the latest 3 items from each "batch".
						let tech = 'NOT DEFINED';
						if (typeof r.name !== 'undefined') {
							if (r.name=== 1) { tech = 'production'; }
							else if (r.name=== 2) { tech = 'nuclear'; }
							else if (r.name=== 3) { tech = 'thermal'; }
							else if (r.name=== 4) { tech = 'unknown'; }
							else if (r.name=== 5) { tech = 'wind'; }
							else if (r.name=== 6) { tech = 'hydro'; }
							else if (r.name=== 7) { tech = 'consumption'; }
						}
						if (typeof r.data !== 'undefined' && Array.isArray(r.data)) {
							const latest = r.data.slice(-1);
							latest.forEach(i=>{
								// i.x = Unix timestamp
								// i.y = Value
								self.values.push({
									'technology': tech,
									'time': moment(i.x).format(),
									'value': i.y
								});
								// RESOLUTION is ONE MINUTE: 
								// "time=", "2021-06-04T15:59:00+03:00", " value=", 845
								// "time=", "2021-06-04T16:00:00+03:00", " value=", 845
								// "time=", "2021-06-04T16:01:00+03:00", " value=", 845
								//console.log(['time=',moment(i.x).format(),' value=',i.y]);
							});
						}
					});
				}
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
}
