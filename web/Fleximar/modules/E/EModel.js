import EventObserver from '../common/EventObserver.js';

/*
class Fruit {
	constructor(type) {
		this.type = type;
		this.id = Math.random(); // random numer between zero and 1
	}
}
*/
export default class EModel extends EventObserver {
	
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
		//this.fruits = [];
		//this.selectedFruit = undefined;
		//this.numberOfApples = 3;
	}
	
	reset() {
		/*
		this.fruits = [];
		for (let i=0; i<this.numberOfApples; i++) {
			const fruit = new Fruit('apple');
			this.fruits.push(fruit);
		}
		console.log(['fruits=',this.fruits]);
		this.notifyAll({model:this.name, method:'fruit-reset'});
		*/
	}
	/*
	selectFruit(id) {
		this.selectedFruit = id;
		
		let index = undefined;
		this.fruits.forEach((fruit,i) => {
			if (fruit.id === id) {
				index = i;
			}
		});
		console.log(['index=',index]);
		if (typeof index !== 'undefined') {
			if (this.fruits[index].type === 'lemon') {
				// remove this from the BOWL!
				console.log('REMOVE FRUIT!');
				this.fruits = this.fruits.filter((d,i)=> i !== index);
			} else {
				// Change apple to lemon!
				console.log('CHANGE APPLE TO LEMON!');
				this.fruits[index].type = 'lemon';
			}
			setTimeout(() => {
				this.notifyAll({model:this.name, method:'fruit-selected'});
			},200);
		}
	}*/
	/*
	addFruit(type) {
		const fruit = new Fruit(type);
		this.fruits.push(fruit);
		setTimeout(() => {
			this.notifyAll({model:this.name, method:'fruit-added'});
		},200);
	}*/
	
	/* Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	*/
	
	fetch(token) {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		//const debug_time_start = moment().valueOf();
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		let start_date = moment().format('YYYY-MM-DD');
		let end_date = moment().format('YYYY-MM-DD');
		
		//if (this.timerange > 1) {
		//	const diffe = this.timerange-1;
		//	start_date = moment().subtract(diffe, 'days').format('YYYY-MM-DD');
		//}
		// append start and end date
		const url = /*this.backend + '/' + */ this.src + '&start='+start_date+'&end='+end_date;
		
		console.log (['EModel fetch url=',url]);
		status = 200; // OK
		//this.fruits = [];
		//status = 401;
		//this.errorMessage = 'Auth failed';
		setTimeout(() => {
			
			this.fetching = false;
			this.ready = true;
			/*
			for (let i=0; i<this.numberOfApples; i++) {
				const fruit = new Fruit('apple');
				this.fruits.push(fruit);
			}
			console.log(['fruits=',this.fruits]);*/
			this.notifyAll({model:this.name, method:'fetched', status:status, message:this.errorMessage});
			
		}, 200);
		
		/*
		fetch(url)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				self.values = []; // Start with fresh empty data.
				self.energyValues = [];
				
				self.process(myJson);
				
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
		*/
	}
}

