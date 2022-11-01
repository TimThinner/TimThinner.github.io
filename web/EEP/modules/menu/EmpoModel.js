import Model from '../common/Model.js';
/*


NOTE:
New REST-API interface:

https://app.swaggerhub.com/apis/jean-nicolas.louis/emission-and_power_grid_status/1.0.0

The one that we need to retrieve is:
http://128.214.253.150/api/v1/resources/emissions/latest?country=Finland&EmDB=EcoInvent 

RESPONSE EXAMPLE:

{ "results": [ { "country": "FI", "date_time": "2021-11-16 10:31:06", "em_cons": 160.305, "em_prod": 148.0854, "emdb": "EcoInvent", "id": 159293 } ] }



http://128.214.253.150/api/v1/resources/emissions/findByDate?startdate="2021-11-11 00:00:00"&enddate="2021-11-12 00:00:00"&country=Finland&EmDB=EcoInvent

This link should work for the last 24 hours.

http://128.214.253.150/api/v1/resources/emissions/findByDate?startdate=2021-11-15%2015%3A00%3A00&enddate=2021-11-16%2015%3A00%3A00&EmDB=EcoInvent&country=FI

The special characters have to be encoded in hex format to be passed correctly in Apache.

startdate	2021-11-15 15:00:00
enddate		2021-11-16 15:00:00

{ "results": [ 
{ "country": "FI", "date_time": "2021-11-15 15:27:49", "em_cons": 138.5389, "em_prod": 139.6106, "emdb": "EcoInvent", "id": 154805 },
{ "country": "FI", "date_time": "2021-11-15 15:01:03", "em_cons": 140.5014, "em_prod": 141.0444, "emdb": "EcoInvent", "id": 154697 }, 
{ "country": "FI", "date_time": "2021-11-15 15:03:51", "em_cons": 140.0652, "em_prod": 140.3119, "emdb": "EcoInvent", "id": 154709 }, 
{ "country": "FI", "date_time": "2021-11-15 15:06:50", "em_cons": 139.1719, "em_prod": 140.0983, "emdb": "EcoInvent", "id": 154721 }, 
{ "country": "FI", "date_time": "2021-11-15 15:09:47", "em_cons": 139.2262, "em_prod": 139.3469, "emdb": "EcoInvent", "id": 154733 },
{ "country": "FI", "date_time": "2021-11-15 15:12:51", "em_cons": 133.4101, "em_prod": 131.4101, "emdb": "EcoInvent", "id": 154745 }, 
{ "country": "FI", "date_time": "2021-11-15 15:15:49", "em_cons": 138.7291, "em_prod": 139.1655, "emdb": "EcoInvent", "id": 154757 }, 
{ "country": "FI", "date_time": "2021-11-15 15:18:50", "em_cons": 137.6219, "em_prod": 139.1177, "emdb": "EcoInvent", "id": 154769 }, 
{ "country": "FI", "date_time": "2021-11-15 15:21:47", "em_cons": 138.0801, "em_prod": 138.9064, "emdb": "EcoInvent", "id": 154781 }, 
{ "country": "FI", "date_time": "2021-11-15 15:24:46", "em_cons": 138.1404, "em_prod": 138.8927, "emdb": "EcoInvent", "id": 154793 }, 
{ "country": "FI", "date_time": "2021-11-15 15:54:46", "em_cons": 137.1245, "em_prod": 139.4446, "emdb": "EcoInvent", "id": 154913 }, 
{ "country": "FI", "date_time": "2021-11-15 15:57:54", "em_cons": 137.4408, "em_prod": 139.4716, "emdb": "EcoInvent", "id": 154925 }, 
{ "country": "FI", "date_time": "2021-11-15 16:01:04", "em_cons": 136.9022, "em_prod": 139.0409, "emdb": "EcoInvent", "id": 154937 }, 
{ "country": "FI", "date_time": "2021-11-15 16:03:50", "em_cons": 137.7152, "em_prod": 139.8539, "emdb": "EcoInvent", "id": 154949 }, 
{ "country": "FI", "date_time": "2021-11-15 16:06:51", "em_cons": 137.4524, "em_prod": 139.573, "emdb": "EcoInvent", "id": 154961 }, { "country": "FI", "date_time": "2021-11-15 16:09:45", "em_cons": 137.2685, "em_prod": 139.5414, "emdb": "EcoInvent", "id": 154973 }, { "country": "FI", "date_time": "2021-11-15 16:12:45", "em_cons": 136.8294, "em_prod": 139.2051, "emdb": "EcoInvent", "id": 154985 }, { "country": "FI", "date_time": "2021-11-15 16:15:50", "em_cons": 122.591, "em_prod": 138.5728, "emdb": "EcoInvent", "id": 154997 }, { "country": "FI", "date_time": "2



Emission and power grid status:

emissions
GET/api/v1/resources/emissions/latest
GET/api/v1/resources/emissions/findByDate
Power
GET/api/v1/resources/power/findByDate
GET/api/v1/resources/power/latest



http://128.214.253.150/api/v1/resources/emissions/findByDate?startdate=2021-11-15%2015%3A00%3A00&enddate=2021-11-16%2015%3A00%3A00&EmDB=EcoInvent&country=FI


http://128.214.253.150/api/v1/resources/emissions/findByDate?startdate=2022-10-31%2008%3A00%3A00&enddate=2022-11-01%2008%3A00%3A00&EmDB=EcoInvent&country=FI



179.1292, "emdb": "EcoInvent", "id": 6392885 }, 

{ "country": "FI", "date_time": "2022-11-01 06:57:56", "em_cons": 60.5332, "em_prod": 180.1791, "emdb": "EcoInvent", "id": 6392945 },
{ "country": "FI", "date_time": "2022-11-01 06:52:13", "em_cons": 60.1373, "em_prod": 179.2593, "emdb": "EcoInvent", "id": 6392801 }, 
{ "country": "FI", "date_time": "2022-11-01 07:08:38", "em_cons": 80.6742, "em_prod": 183.2567, "emdb": "EcoInvent", "id": 6393142 }, 
{ "country": "FI", "date_time": "2022-11-01 07:01:25", "em_cons": 63.5253, "em_prod": 179.9349, "emdb": "EcoInvent", "id": 6393023 }, 
{ "country": "FI", "date_time": "2022-11-01 07:05:01", "em_cons": 81.2973, "em_prod": 181.3496, "emdb": "EcoInvent", "id": 6393077 }, 
{ "country": "FI", "date_time": "2022-11-01 07:11:26", "em_cons": 111.4928, "em_prod": 183.2567, "emdb": "EcoInvent", "id": 6393205 }, 
{ "country": "FI", "date_time": "2022-11-01 07:14:40", "em_cons": 86.1194, "em_prod": 181.4829, "emdb": "EcoInvent", "id": 6393269 }, 
{ "country": "FI", "date_time": "2022-11-01 07:23:28", "em_cons": 110.9607, "em_prod": 181.7304, "emdb": "EcoInvent", "id": 6393462 }, 
{ "country": "FI", "date_time": "2022-11-01 07:17:45", "em_cons": 92.6784, "em_prod": 181.6438, "emdb": "EcoInvent", "id": 6393333 }, 
{ "country": "FI", "date_time": "2022-11-01 07:20:33", "em_cons": 91.1085, "em_prod": 181.6438, "emdb": "EcoInvent", "id": 6393397 }, 
{ "country": "FI", "date_time": "2022-11-01 07:26:22", "em_cons": 97.8776, "em_prod": 182.0591, "emdb": "EcoInvent", "id": 6393525 }, 
{ "country": "FI", "date_time": "2022-11-01 07:29:58", "em_cons": 130.9697, "em_prod": 180.7455, "emdb": "EcoInvent", "id": 6393610 }, 
{ "country": "FI", "date_time": "2022-11-01 07:39:24", "em_cons": 167.2586, "em_prod": 182.5731, "emdb": "EcoInvent", "id": 6393781 }, 
{ "country": "FI", "date_time": "2022-11-01 07:33:37", "em_cons": 126.7898, "em_prod": 180.9003, "emdb": "EcoInvent", "id": 6393653 }, 
{ "country": "FI", "date_time": "2022-11-01 07:36:32", "em_cons": 130.8755, "em_prod": 181.3248, "emdb": "EcoInvent", "id": 6393753 }, 
{ "country": "FI", "date_time": "2022-11-01 07:42:26", "em_cons": 99.9607, "em_prod": 183.1428, "emdb": "EcoInvent", "id": 6393845 }, 
{ "country": "FI", "date_time": "2022-11-01 07:45:20", "em_cons": 121.7064, "em_prod": 183.2195, "emdb": "EcoInvent", "id": 6393911 }, 
{ "country": "FI", "date_time": "2022-11-01 07:48:15", "em_cons": 97.5617, "em_prod": 182.2528, "emdb": "EcoInvent", "id": 6393973 }, 
{ "country": "FI", "date_time": "2022-11-01 07:51:21", "em_cons": 103.3297, "em_prod": 183.0886, "emdb": "EcoInvent", "id": 6394054 }, 
{ "country": "FI", "date_time": "2022-11-01 07:54:11", "em_cons": 102.513, "em_prod": 183.8301, "emdb": "EcoInvent", "id": 6394101 }, 
{ "country": "FI", "date_time": "2022-11-01 07:57:12", "em_cons": 103.671, "em_prod": 184.1979, "emdb": "EcoInvent", "id": 6394197 } ] }


*/
export default class EmpoModel extends Model {
	
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
		
		
		if (typeof options.timerange_start_subtract_hours !== 'undefined') {
			this.timerange_start_subtract_hours = options.timerange_start_subtract_hours;
		} else {
			this.timerange_start_subtract_hours = 24;
		}
		if (typeof options.timerange_end_subtract_hours !== 'undefined') {
			this.timerange_end_subtract_hours = options.timerange_end_subtract_hours;
		} else {
			this.timerange_end_subtract_hours = 0;
		}
		
		
		//this.value = undefined;
		this.results = [];
		
		//this.start_time = undefined;
		//this.end_time = undefined;
	}
	
	fetch() {
		const self = this;
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		let body_url = this.src;
		if (body_url.indexOf('findByDate') >= 0) {
			
			const startdate = moment.utc().subtract(this.timerange_start_subtract_hours, 'hours');
			//startdate.subtract(3, 'minutes');
			startdate.minute(0);
			startdate.second(0);
			const start = startdate.format("YYYY-MM-DD HH:mm:ss");
			
			const enddate = moment.utc().subtract(this.timerange_end_subtract_hours, 'hours');
			//enddate.subtract(3, 'minutes');
			enddate.minute(0);
			enddate.second(0);
			const end = enddate.format("YYYY-MM-DD HH:mm:ss");
			
			body_url += '&startdate='+start+'&enddate='+end;
		}
		const body_url_encoded = encodeURI(body_url);
		//console.log(['body_url_encoded=',body_url_encoded]);
		
		const url = this.mongoBackend + '/proxes/empo';
		
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const data = {
			url: body_url_encoded,
			expiration_in_seconds: 180 // 3 minutes
		};
		const myPost = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		
		this.results = []; // Start with fresh empty data.
		
		const myRequest = new Request(url, myPost);
		fetch(myRequest)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				
				//console.log(['myJson=',myJson]);
				const resu = JSON.parse(myJson);
				//console.log(['EmpoModel resu=',resu]);
				
				if (typeof resu !== 'undefined' && typeof resu.results !== 'undefined') {
					self.results = resu.results;
				}
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:'OK'});
			})
			.catch(error => {
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
			});
	}
}
