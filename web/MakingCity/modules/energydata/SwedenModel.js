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
		//this.values = [];
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
		
		const url = this.mongoBackend + '/proxette/sweden';
		const body_url = this.src;
		const body_production_date = moment().subtract(1, 'days').format('YYYY-MM-DD');
		
		// req.body.url					https://www.svk.se/ControlRoom/GetProductionHistory/
		// req.body.production_date		YYYY-MM-DD
		//let url = req.body.url + '?productionDate=' + req.body.production_date + '&countryCode=SE';
		
		const data = {
			url: body_url,
			production_date: body_production_date
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
				console.log(['myJson=',myJson]);
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
*/
				if (typeof myJson !== 'undefined' && Array.isArray(myJson)) {
					myJson.forEach(r=>{
						// 7 x 1422 elements => print to console only the first and last item from each "batch".
						if (typeof r.data !== 'undefined' && Array.isArray(r.data)) {
							const last_index = r.data.length-1;
							console.log(['last_index=',last_index]);
							
							
							r.data.forEach((i,ind)=>{
								// i.x = Unix timestamp
								// i.y = Value
								if (ind === 0 || ind === last_index) {
									console.log(['time=',moment(i.x).format(),' value=',i.y]);
								}
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
