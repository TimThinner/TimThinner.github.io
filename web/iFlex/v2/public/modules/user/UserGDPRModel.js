import Model from '../common/Model.js';
/*
	Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	}
	
	Dummy reset.
	reset() {
		
	}
	
	Dummy fetch.
	fetch() {
		console.log('DUMMY FETCH!');
		this.ready = true;
	}
*/
export default class UserGDPRModel extends Model {
	
	constructor(options) {
		super(options);
		this.ready = true;
		this.status = 200;
		this.caller = undefined;
	}
}
