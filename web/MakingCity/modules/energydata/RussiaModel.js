import Model from '../common/Model.js';

export default class RussiaModel extends Model {
	
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
		this.averages = {};
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
		
		const url = this.mongoBackend + '/proxes/russia';
		const body_url = this.src; // URL will be appended in backend.
		//const body_start_date = moment().subtract(1, 'days').format('YYYY.MM.DD'); // 'yyyy.MM.dd'
		//const body_end_date = moment().subtract(1, 'days').format('YYYY.MM.DD'); // 'yyyy.MM.dd'
		
		const body_start_date = moment().format('YYYY.MM.DD'); // 'yyyy.MM.dd'
		const body_end_date = moment().format('YYYY.MM.DD'); // 'yyyy.MM.dd'
		
		const data = {
			url: body_url,
			start_date: body_start_date,
			end_date: body_end_date,
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
RESPONSE:
[
  {
    "$id": "1",
    "m_Item1": 1,
    "m_Item2": [
      {
        "INTERVAL": 0,
        "M_DATE": "2021-05-24T00:00:00+03:00",
        "P_AES": 22519.451171875,
        "P_GES": 9818.150390625,
        "P_TES": 34141.2421875,
        "P_BS": 6375.35205078125,
        "P_REN": 0
      },
      ...
      {
        "INTERVAL": 23,
        "M_DATE": "2021-05-24T00:00:00+03:00",
        "P_AES": 22870,
        "P_GES": 11249.2998046875,
        "P_TES": 36445.94921875,
        "P_BS": 6572.93115234375,
        "P_REN": 0
      }
    ]
  }
]
where 
P_AES is nuclear power, 
P_REN is solar, 
P_BS is some stock (mainly pulp and paper factories), 
P_TES are CHP units, and 
P_GES are hydropower stations.
*/
				self.values = [];
				self.averages = {};
				
				const json = JSON.parse(myJson);
				if (typeof json !== 'undefined' && Array.isArray(json)) {
					// Calculate average from all values:
					let SUM_P_AES = 0;
					let SUM_P_REN = 0;
					let SUM_P_BS = 0;
					let SUM_P_TES = 0;
					let SUM_P_GES = 0;
					let count = 0;
					json.forEach(r=>{
						if (typeof r.m_Item2 !== 'undefined' && Array.isArray(r.m_Item2)) {
							r.m_Item2.forEach(i=>{
								SUM_P_AES += i.P_AES;
								SUM_P_REN += i.P_REN;
								SUM_P_BS += i.P_BS;
								SUM_P_TES += i.P_TES;
								SUM_P_GES += i.P_GES;
								count++;
								self.values.push({
									'nuclear': i.P_AES,
									'solar': i.P_REN,
									'stock': i.P_BS,
									'chp': i.P_TES,
									'hydropower': i.P_GES
								});
							});
						}
					});
					if (count > 0) {
						self.averages['nuclear'] = SUM_P_AES/count;
						self.averages['solar'] = SUM_P_REN/count;
						self.averages['stock'] = SUM_P_BS/count;
						self.averages['chp'] = SUM_P_TES/count;
						self.averages['hydropower'] = SUM_P_GES/count;
					}
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
