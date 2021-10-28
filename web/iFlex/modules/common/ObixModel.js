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

const auth = 'Basic ' + btoa('user:pass');
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




PT30S (30 seconds)
PT5M (5 minutes)
PT1H (1 hour)
PT24H (24 hours)

INTERVAL	TIMERANGE		NUMBER OF SAMPLES
1 MIN		1 day (24H)		1440 (24 x 60)
10 MINS		1 week			1008 (7 x 24 x 6)
30 MINS 	1 month			1440 (30 x 48)
4 HOURS		6 months		1080 (30 x 6 x 6)
6 HOURS		1 year			1460 (4 x 365)








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
		/*
		if (typeof options.cache_expiration_in_seconds !== 'undefined') {
			this.cache_expiration_in_seconds = options.cache_expiration_in_seconds;
		} else {
			this.cache_expiration_in_seconds = 60;
		}
		*/
		this.cache_expiration_in_seconds = 60;
		/*
		if (typeof options.timerange !== 'undefined') {
			this.timerange = options.timerange;
		} else {
			this.timerange = {begin:{value:1,unit:'days'},end:{value:0,unit:'days'}};
		}*/
		this.timerange = { begin:{value:1,unit:'days'}, end:{value:0,unit:'days'} };
		// define interval for ROLLUP API
		/*
		if (typeof options.interval !== 'undefined') {
			this.interval = options.interval;
		} else {
			this.interval = undefined;
		}*/
		this.interval = 'PT15M';
		this.access = options.access; // 'PUBLIC' or 'PRIVATE'
	}
	
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
	fetch(token, readkey, obix_code) {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		this.status = 500;
		this.errorMessage = '';
		this.fetching = true;
		this.ready = false;
		
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		
		// Normal user has a readkey, which was created when user registered into the system. 
		//const url = 'https://ba.vtt.fi/TestServlet/testHistory/query/';
		
		// NOTE: readkey can be undefined.
		// This is ALWAYS the case when public data (building data) is fetched.
		let my_readkey = undefined;
		let my_obix_code = undefined;
		if (this.access === 'PRIVATE') {
			my_readkey = readkey;
			my_obix_code = obix_code;
		}
		/*
			NOTE: Consider if two diferent endpoints should be used here. 
			One for anonymous calls and one for authenticated calls.
			OR can we cope with this one and check if readkey is defined...
		*/
		const url = this.mongoBackend + '/proxes/obix/';
		// 5 s interval => 12 samples in 60 seconds.
		// One hour (60*60 seconds) takes 60 * 12 samples = 720 samples
		
		// "emissionFactorForElectricityConsumedInFinland/query/" once every 3 minutes => 
		// 1 hour = 20 values = > 24 h = 24 x 20 = 480 values
		
		//let start = moment().subtract(24*3600, 'seconds').format();
		//console.log(['start=',start]);
		
		// Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://ba.vtt.fi/TestServlet/testHistory/query/. 
		// (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).
		/*
		const reqXML = //'<?xml version="1.0" encoding="UTF-8"?>'+
		'<obj is="obix:HistoryFilter" xmlns="http://obix.org/ns/schema/1.0">'+
		'<int name="limit" val="3"/>'+
		'<abstime name="start" val="'+start+'"/>'+
		'<abstime name="end" null="true"/>'+
		'</obj>';*/
		
		/*
		const reqXML = '<?xml version="1.0" encoding="UTF-8"?>'+
		'<obj href="obix:HistoryFilter" xmlns="http://obix.org/ns/schema/1.0">'+
		'<int name="limit" null="true"/>'+
		'<abstime name="start" val="'+start+'"/>'+
		'<abstime name="end" null="true"/>'+
		'</obj>';
		*/
		
		// Fetching values for URL+1d, URL+2d, URL+3d, ...
		// this.timerange has the number of days to be subtracted from now.
		
		//let start = moment().subtract(this.rangeValue,this.rangeUnit).format();
		
		
		// Testing 
		//curl -u 'timokinnunen':'tuaxiMun0wx6ff!sBaq' -s -H "Content-Type: text/xml;charset=UTF-8" -d "<obj is=\"obix:HistoryFilter\" xmlns=\"http://obix.org/ns/schema/1.0\"><int name=\"limit\" val=\"20\" /><abstime name=\"start\" val=\"2021-09-03T09:51:15.062Z\"/><abstime name=\"end\" val=\"2021-09-05T09:51:15.062Z\"/></obj>" https://ba.vtt.fi/obixStore/store/NuukaOpenData/1752%20Malmitalo/Heat/
		
		//curl -u 'timokinnunen':'tuaxiMun0wx6ff!sBaq' -s -H "Content-Type: text/xml;charset=UTF-8" -d "<obj is=\"obix:HistoryFilter\" xmlns=\"http://obix.org/ns/schema/1.0\"><int name=\"limit\" val=\"20\" /><abstime name=\"start\" val=\"2021-09-03T09:51:15.062Z\"/><abstime name=\"end\" val=\"2021-09-05T09:51:15.062Z\"/></obj>" https://ba.vtt.fi/obixStore/store/NuukaOpenData/1752%20Malmitalo/Electricity/
		
		
		const start_mom = moment().subtract(this.timerange.begin.value, this.timerange.begin.unit);
		start_mom.milliseconds(0);
		start_mom.seconds(0);
		const start = start_mom.format();
		
		const end_mom = moment().subtract(this.timerange.end.value, this.timerange.end.unit);
		end_mom.milliseconds(0);
		end_mom.seconds(0);
		const end = end_mom.format();
		
		const now = moment().format('YYYY-MM-DDTHH');
		const interval = this.interval;
		
		// We can select dynamically whether data fetcher uses "QUERY" or "ROLLUP" API:
		// "query/" or "rollup/" is added at ObixModel depending on if "interval" is defined or not.
		let source = this.src;
		
		// Also here we append obix_code if it is defined.
		if (typeof my_obix_code !== 'undefined') {
			source =  this.src + obix_code + '/';
		}
		//console.log('===========================');
		//console.log(['fetch token=',token]);
		//console.log(['fetch my_readkey=',my_readkey]);
		//console.log(['fetch my_obix_code=',my_obix_code]);
		//console.log(['fetch source=',source]);
		//console.log('===========================');
		
		let reqXML = '';
		let hash = '';
		// Create a hash using URL and timerange and CURRENT DATETIME IN HOUR PRECISION.
		// This is how we can cover different responses having timestamp to help cleaning 
		// in BACKEND.
		const from_to_string = '_from_' + this.timerange.begin.value + '_' + this.timerange.begin.unit + '_to_' + this.timerange.end.value + '_' + this.timerange.end.unit + now;
		if (typeof interval !== 'undefined') {
			source += 'rollup/';
			hash = source + from_to_string + '_' + interval;
			console.log(['hash=',hash]);
			reqXML = '<?xml version="1.0" encoding="UTF-8"?>'+
			'<obj is="obix:HistoryRollupIn obix:HistoryFilter" xmlns="http://obix.org/ns/schema/1.0">'+
			'<reltime name="interval" val="'+interval+'"/>'+
			'<int name="limit" null="true"/>'+
			'<abstime name="start" val="'+start+'"/>'+
			'<abstime name="end" val="'+end+'"/>'+
			'</obj>';
			
		} else {
			source += 'query/';
			hash = source + from_to_string;
			console.log(['hash=',hash]);
			reqXML = '<?xml version="1.0" encoding="UTF-8"?>'+
			'<obj is="obix:HistoryFilter" xmlns="http://obix.org/ns/schema/1.0">'+
			'<int name="limit" null="true"/>'+
			'<abstime name="start" val="'+start+'"/>'+
			'<abstime name="end" val="'+end+'"/>'+
			//'<abstime name="end" null="true"/>'+
			'</obj>';
		}
		
		//path: '/obixStore/store/Fingrid/emissionFactorForElectricityConsumedInFinland/query/',
		//path: '/obixStore/store/Fingrid/emissionFactorOfElectricityProductionInFinland/query/',
		const data = { 
			type: 'text/xml;charset=UTF-8',
			readkey: my_readkey,
			xml: reqXML,
			hash: hash,
			obix_url: source,
			expiration_in_seconds: this.cache_expiration_in_seconds
		};
		const myPost = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		const myRequest = new Request(url, myPost);
		
		// RESET data at the TOP. 
		this.values = [];
		
		fetch(myRequest)
			.then(function(response) {
				self.status = response.status;
				//console.log(['status=',self.status]);
				//console.log(['response=',response]);
				return response.json();
			})
			.then(function(myJson) {
				if (self.status === 200) {
					//console.log(['myJson=',myJson]);
					const resu = JSON.parse(myJson);
					//const cleaned = myJson.replace(/\\/g, "");
					//console.log(['cleaned=',cleaned]);
					if (typeof resu.obj !== 'undefined') {
						
						/*
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
						*/
						// Response is different for query and rollup:
						if (typeof resu.obj.list !== 'undefined' && Array.isArray(resu.obj.list)) {
							
							resu.obj.list.forEach(li=>{
								if (typeof li.obj !== 'undefined' && Array.isArray(li.obj)) {
									li.obj.forEach(foo=>{
										//console.log(['foo=',foo]);
										//console.log([foo.abstime[0]['$'].name, ' ',foo.abstime[0]['$'].val]);
										//console.log([foo.real[0]['$'].name,' ',foo.real[0]['$'].val]);
										
										// IN ROLLUP the following takes abstime => start 
										let ts = undefined;
										let val = undefined;
										
										foo.abstime.forEach(at=>{
											// if we have a at.$.name === 'timestamp' we have a query timestamp
											if (at['$'].name === 'timestamp') {
												ts = at['$'].val;
											} else if (at['$'].name === 'start') { // in rollup use "start" (ignore "end")
												ts = at['$'].val;
											}
										});
										
										foo.real.forEach(r=>{
											if (r['$'].name === 'value') {
												val = r['$'].val;
											} else if (r['$'].name === 'avg') { // in rollup use "avg" (ignore "min", "max" and "sum")
												val = r['$'].val;
											}
										});
										
										if (typeof ts !== 'undefined' && typeof val !== 'undefined') {
											const date = new Date(ts);
											self.values.push({'timestamp':date,'value':val});
										}
										
									});
								}
							});
						}
						// resu.obj.$ {}
						// resu.obj.abstime [  {$:{name:"start",val:"2021-05-26T12:00:01.900039+03:00"}}, {$:{name:"end",val:""}}  ]
						// resu.obj.int [  {$:{name:"count", val:"456"}}   ]
						// resu.obj.list [   { $:{}, obj:[ {abstime:[{$:{name:"timestamp", val:""}}]  , real:[{$:{name:"value", val:""}}]    }  ]   }  ]
						
						/*
[
"myJson=", 
"{"obj":{	"$":{"xmlns":"http://obix.org/ns/schema/1.0","is":"obix:HistoryRollupOut"},
			"list":
				[
					{
					"$":{"name":"data","of":"obix:HistoryRollupRecord"},
					"obj": [
						{
							"abstime":[
								{"$":{"name":"start","val":"2021-09-20T09:57:06+03:00"}},
								{"$":{"name":"end","val":"2021-09-21T09:57:06+03:00"}}
							],
							"int":[{"$":{"name":"count","val":"24"}}],
							"real":[
								{"$":{"name":"min","val":"46.18"}},
								{"$":{"name":"max","val":"151.94"}},
								{"$":{"name":"avg","val":"97.16000000000003"}},
								{"$":{"name":"sum","val":"2331.8400000000006"}}
							]
						},
						{
							"abstime":[
								{"$":{"name":"start","val":"2021-09-21T09:57:06+03:00"}},
								{"$":{"name":"end","val":"2021-09-22T09:57:06+03:00"}}
							],
							"int":[{"$":{"name":"count","val":"24"}}],
							"real\":[
								{"$":{"name":"min","val":"53.29"}},
								{"$":{"name":"max","val":"159.85000000000002"}},
								{"$":{"name":"avg","val":"112.59166666666665"}},
								{"$":{"name":"sum","val":"2702.2"}}
							]
						},
]						
						*/
					}
					self.fetching = false;
					self.ready = true;
					self.notifyAll({model:self.name, method:'fetched', status:self.status, message:'OK'});
					
				} else if (self.status === 500) {
					self.fetching = false;
					self.ready = true;
					self.notifyAll({model:self.name, method:'fetched', status:self.status, message:'SERVER ERROR!'});
					
				} else  {
					self.fetching = false;
					self.ready = true;
					console.log(['myJson=',myJson]);
					const message = myJson.message;
					self.notifyAll({model:self.name, method:'fetched', status:self.status, message:message});
				}
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
