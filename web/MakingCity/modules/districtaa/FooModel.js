import EventObserver from '../common/EventObserver.js';
/*

*/
export class FoobarModel {
	constructor(obj) {
		this.time = new Date(obj.time); // "2019-10-25T11:13:39.833Z"
		this.foobar = obj.foobar;   // float
	}
}

export default class FooModel extends EventObserver {
	
	constructor() {
		super();
		this.src = undefined;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
		
		this.values = [];
	}
	
	simulate() {
		const self = this;
		const now = moment();
		let start = moment().subtract(30,'days');
		const myJson = [];
		//let k = Math.round(now.seconds()/10) + now.minutes()*6;
		//let k = now.seconds() + now.minutes()*6;
		let k = now.hours();
		
		const coeff = Math.PI/180;
		while(now.isAfter(start)) {
			start.add(5, 'hours');
			const f = 100+Math.sin(k*coeff)*100;
			//e = 100+Math.cos(k*coeff)*100;
			//const f = 100 + Math.round(Math.random()*1000); // W!
			
			myJson.push({time:start.format(),foobar:f});
			if (k < 360) {
				k++;
			} else {
				k=0;
			}
		}
		this.values = []; // Start with fresh array.
		$.each(myJson, function(i,v){
			const p = new FoobarModel(v);
			self.values.push(p);
		});
	}
	
	fetch() {
		//const self = this;
		if (this.fetching) {
			console.log('FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		this.src = 'foo-model';
		const url = this.backend + '/' + this.src;
		console.log (['fetch url=',url]);
		
		this.simulate();
		
		setTimeout(() => {
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:'FooModel',method:'fetched',status:200,message:'OK'});
		}, 200);
	}
}
