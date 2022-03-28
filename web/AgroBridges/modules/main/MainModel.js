
import Model from '../common/Model.js';

export default class MainModel extends Model {
	/*
		Inherits from Model:
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	*/
	constructor(options) {
		super(options);
		this.ready = true; // Always true!
		this.status = 200; // Always OK!
	}
}
