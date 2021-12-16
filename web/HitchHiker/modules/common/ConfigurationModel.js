import Model from './Model.js';

export default class ConfigurationModel extends Model {
	constructor(options) {
		super(options); // options.name, options.src
		this.mongoBackend = 'http://localhost:3000';
	}
}
