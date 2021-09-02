import Model from '../common/Model.js';

/*
https://ba.vtt.fi/TestServlet/testHistory/query/
user
pass


var decodedStringBtoA = 'user';
// Encode the String
var encodedUser = btoa();
console.log();


In basic HTTP authentication, a request contains a header field in the form of Authorization: Basic <credentials>, where credentials is the Base64 encoding of ID and password joined by a single colon :.

Authorization: Basic Base64_encoding_of_ID:Base64_encoding_of_password

const auth = 'Basic ' + btoa('user') + ':' + btoa('pass');
Authorization: auth

<?xml version="1.0" encoding="UTF-8"?>
<obj href="obix:HistoryFilter" xmlns="http://obix.org/ns/schema/1.0">
<int name="limit" null="true"/>
<abstime name="start" val="2021-05-18T14:00:00.000+03:00"/>
<abstime name="end" null="true"/>
</obj>

Testaa seuraavaa komentoa komentoriviltä 
curl -u user:pass -s -H "Content-Type: application/xml" -d "<obj is=\"obix:HistoryFilter\" xmlns=\"http://obix.org/ns/schema/1.0\"> name=\"limit\" val=\"3\" /><abstime name=\"start\" val=\"2021-05-03T09:51:15.062Z\"/><abstime name=\"end\" null=\"true\"/></obj>" https://ba.vtt.fi/TestServlet/testHistory/query/



'Access-Control-Allow-Origin','*'
'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
'Access-Control-Allow-Methods','GET, POST, OPTIONS'

Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://ba.vtt.fi/TestServlet/testHistory/query/. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://ba.vtt.fi/TestServlet/testHistory/query/. (Reason: CORS request did not succeed).


*/
export default class ObixModel extends Model {
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	*/
	constructor(options) {
		super(options);
		this.values = [];
		if (typeof options.cache_expiration_in_seconds !== 'undefined') {
			this.cache_expiration_in_seconds = options.cache_expiration_in_seconds;
		} else {
			this.cache_expiration_in_seconds = 60;
		}
	}
	
	
	/*
	NOTE: This fetches directly from source... NOT using proxy. 
	fetch() {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		this.status = 500;
		this.errorMessage = '';
		this.fetching = true;
		this.ready = false;
		
		const base64user = btoa('user');
		const base64pass = btoa('pass');
		
		const myHeaders = new Headers();
		const authorizationToken = 'Basic '+ base64user + '' + base64pass;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/xml");
		
		const url = 'https://ba.vtt.fi/TestServlet/testHistory/query/';
		
		 // Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://ba.vtt.fi/TestServlet/testHistory/query/. 
		 // (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).
		
		const reqXML = '<?xml version="1.0" encoding="UTF-8"?>'+
		'<obj href="obix:HistoryFilter" xmlns="http://obix.org/ns/schema/1.0">'+
		'<int name="limit" null="true"/>'+
		'<abstime name="start" val="2021-05-26T11:50:00.000+03:00"/>'+
		'<abstime name="end" null="true"/>'+
		'</obj>';
		
		const myPost = {
			method: 'POST',
			headers: myHeaders,
			body: reqXML
		};
		const myRequest = new Request(url, myPost);
		
		fetch(myRequest)
			.then(function(response) {
				self.status = response.status;
				return response.text();
			})
			.then(function(xmlString) {
				return $.parseXML(xmlString);
			})
			.then(function(data) {
				console.log(['XML data=',data]);
				
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
	*/
	
	
	
	
	
	
	
	
	
	
	/*
	
	"myJson=", "
	{"obj":
		{"$":
			{
				"xmlns":"http://obix.org/ns/schema/1.0","is":"obix:HistoryQueryOut","href":"https://130.188.4.49/TestServlet/testHistory/query/"
			},
		"list":
			[
				{"$":{"name":"data","of":"obix:HistoryRecord"},
					"obj":[
						{
							"abstime":[{"$":{"name":"timestamp","val":"2021-05-26T12:00:01.900039+03:00"}}],
							"real":[{"$":{"name":"value","val":"0.7438728824386364"}}]
						},
					
					
						
	
	
	
	
{\"abstime\":[{\"$\":{\"name\":\"timestamp\",\"val\":\"2021-05-26T12:00:06.900224+03:00\"}}],\"real\":[{\"$\":{\"name\":\"value\",\"val\":\"0.5133164463059067\"}}]},{\"abstime\":[{\"$\":{\"name\":\"timestamp\",\"val\":\"2021-05-26T12:00:11.90063+03:00\"}}],\"real\":[{\"$\":{\"name\":\"value\",\"val\":\"0.05631319622782782\"}}]},{\"abstime\":[{\"$\":{\"name\":\"timestamp\",\"val\":\"2021-05-26T12:00:16.900825+03:00\"}}],\"real\":[{\"$\":{\"name\":\"value\",\"val\":\"0.9620235322236453\"}}]},{\"abstime\":[{\"$\":{\"name\":\"timestamp\",\"val\":\"2021-05-26T12:00:21.900967+03:00\"}}],\"real\":[{\"$\":{\"name\":\"value\",\"val\":\"0.14896979326727888\"}}]},{\"abstime\":[{\"$\":{\"name\":\"timestamp\",\"val\":\"2021-05-26T12:00:26.901119+03:00\"}}],\"real\":[{\"$\":{\"name\":\"value\",\"val\":\"0.6611146316328825\"}}]},{\"abstime\":[{\"$\":{\"name\":\"timestamp\",\"val\":\"2021-05-26T12:00:31.90123+03:00\"}}],\"real\":[{\"$\":{\"name\":\"value\",\"val\":\"0.4768644916218735\"}}]}]}],


\"int\":[{\"$\":{\"name\":\"count\",\"val\":\"7\"}}],\"abstime\":[{\"$\":{\"name\":\"start\",\"val\":\"2021-05-26T12:00:01.900039+03:00\"}},{\"$\":{\"name\":\"end\",\"val\":\"2021-05-26T12:00:31.90123+03:00\"}}]}}"


:{\"name\":\"start\",\"val\":\"2021-05-26T12:00:01.900039+03:00\"}},{\"$\":{\"name\":\"end\",\"val\":\"2021-05-26T12:00:31.90123+03:00\"}}]}}"

	*/
	fetch() {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		this.status = 500;
		this.errorMessage = '';
		this.fetching = true;
		this.ready = false;
		
		const base64user = btoa('user');
		const base64pass = btoa('pass');
		
		const myHeaders = new Headers();
		const authorizationToken = 'Basic '+ base64user + '' + base64pass;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/json");
		// Normal user has a readkey, which was created when user registered into the system. 
		//const url = 'https://ba.vtt.fi/TestServlet/testHistory/query/';
		
		const url = this.mongoBackend + '/proxes/obix/';
		// 5 s interval => 12 samples in 60 seconds.
		// One hour (60*60 seconds) takes 60 * 12 samples = 720 samples
		let start = moment().subtract(3600, 'seconds').format();
		console.log(['start=',start]);
		
		 // Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://ba.vtt.fi/TestServlet/testHistory/query/. 
		 // (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).
		
		const reqXML = '<?xml version="1.0" encoding="UTF-8"?>'+
		'<obj href="obix:HistoryFilter" xmlns="http://obix.org/ns/schema/1.0">'+
		'<int name="limit" null="true"/>'+
		'<abstime name="start" val="'+start+'"/>'+
		'<abstime name="end" null="true"/>'+
		'</obj>';
		
		const data = { 
			type: 'application/xml',
			auth: authorizationToken, 
			xml: reqXML,
			url: 'Hash-key-to-cache',
			expiration_in_seconds: this.cache_expiration_in_seconds
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
				console.log(['status=',self.status]);
				console.log(['response=',response]);
				return response.json();
			})
			.then(function(myJson) {
				
				console.log(['myJson=',myJson]);
				const resu = JSON.parse(myJson);
				//const cleaned = myJson.replace(/\\/g, "");
				//console.log(['cleaned=',cleaned]);
				if (typeof resu.obj !== 'undefined') {
					if (typeof resu.obj.abstime !== 'undefined' && Array.isArray(resu.obj.abstime)) {
						// If "start" and "end" are defined in request, they are here:
						// We don't need this information => do nothing.
						// resu.obj.abstime [  {$:{name:"start",val:"2021-05-26T12:00:01.900039+03:00"}}, {$:{name:"end",val:""}}  ]
					}
					if (typeof resu.obj.int !== 'undefined' && Array.isArray(resu.obj.int)) {
						typeof resu.obj.int.forEach(item=>{
							if (item['$'].name === 'count') {
								console.log(['name count val = ',item['$'].val]);
							}
						});
					}
					if (typeof resu.obj.list !== 'undefined' && Array.isArray(resu.obj.list)) {
						self.values = []; // Start from scratch.
						resu.obj.list.forEach(li=>{
							if (typeof li.obj !== 'undefined' && Array.isArray(li.obj)) {
								li.obj.forEach(foo=>{
									//console.log(['foo=',foo]);
									//console.log([foo.abstime[0]['$'].name, ' ',foo.abstime[0]['$'].val]);
									//console.log([foo.real[0]['$'].name,' ',foo.real[0]['$'].val]);
									const date = new Date(foo.abstime[0]['$'].val);
									self.values.push({'timestamp':date,'value':foo.real[0]['$'].val});
								});
							}
						});
					}
					// resu.obj.$ {}
					// resu.obj.abstime [  {$:{name:"start",val:"2021-05-26T12:00:01.900039+03:00"}}, {$:{name:"end",val:""}}  ]
					// resu.obj.int [  {$:{name:"count", val:"456"}}   ]
					// resu.obj.list [   { $:{}, obj:[ {abstime:[{$:{name:"timestamp", val:""}}]  , real:[{$:{name:"value", val:""}}]    }  ]   }  ]
				}
				self.fetching = false;
				self.ready = true;
				self.notifyAll({model:self.name, method:'fetched', status:self.status, message:'OK'});
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
