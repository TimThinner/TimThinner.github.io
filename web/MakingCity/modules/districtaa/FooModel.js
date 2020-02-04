import Model from '../common/Model.js';
/*

*/
export class FoobarModel {
	constructor(obj) {
		this.time = new Date(obj.time); // "2019-10-25T11:13:39.833Z"
		this.foobar = obj.foobar;   // float
	}
}

export default class FooModel extends Model {
	
	constructor() {
		super();
		this.values = [];
	}
	
	simulate() {
		const now = moment();
		let start = moment().subtract(30,'days'); // 30 x 24 = 720
		const myJson = [];
		//let k = Math.round(now.seconds()/10) + now.minutes()*6;
		//let k = now.seconds() + now.minutes()*6;
		let k = now.hours();
		
		const coeff = Math.PI/180;
		while(now.isAfter(start)) {
			start.add(1, 'hours');
			const f = 100+Math.sin(k*coeff)*100;
			//e = 100+Math.cos(k*coeff)*100;
			//const f = 100 + Math.round(Math.random()*1000); // W!
			
			myJson.push({time:start.format(),foobar:f});
			k++;
			//if (k < 360) {
			//	k++;
			//} else {
			//	k=0;
			//}
		}
		return myJson;
	}
	
	fetch() {
		if (this.fetching) {
			console.log('FETCHING ALREADY IN PROCESS!');
			return;
		}
		const debug_time_start = moment().valueOf();
		this.fetching = true;
		this.src = 'foo-model';
		const url = this.backend + '/' + this.src;
		console.log (['fetch url=',url]);
		const myJson = this.simulate();
		setTimeout(() => {
			
			this.values = []; // Start with fresh array.
			myJson.forEach(item => {
				const p = new FoobarModel(item);
				this.values.push(p);
			});
			
			const debug_time_elapse = moment().valueOf()-debug_time_start;
			console.log(['FOO debug_time_elapse=',debug_time_elapse]);
			
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:'FooModel',method:'fetched',status:200,message:'OK'});
		}, 300);
	}
}
