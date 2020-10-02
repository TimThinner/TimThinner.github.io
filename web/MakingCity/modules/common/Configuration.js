export default class Configuration {
	constructor() {
		this.MOCKUP = true;
		this.backend = 'https://makingcity.vtt.fi';
		this.mongoBackend = 'http://localhost:3000';
		// NOTE: When this is copied to server, use following setting:
		//this.mongoBackend = 'https://makingcity.vtt.fi/authtest/data';
	}
}
