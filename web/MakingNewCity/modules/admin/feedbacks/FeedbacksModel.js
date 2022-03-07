import Model from '../../common/Model.js';
/*

*/
export default class FeedbacksModel extends Model {
	
	constructor(options) {
		super(options);
		this.feedbacks = [];
		
	}
	
	fetch(token) {
		const self = this;
		//const token = token;
		
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
		this.errorMessage = '';
		this.fetching = true;
		
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		
		const url = this.mongoBackend + '/feedbacks/admin';
		fetch(url, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				//console.log(['myJson=',myJson]);
				self.feedbacks = myJson.feedbacks;
				self.fetching = false;
				self.ready = true;
				let message = 'OK';
				if (typeof self.feedbacks.message !== 'undefined') {
					message = self.feedbacks.message;
				}
				self.notifyAll({model:self.name, method:'fetched', status:status, message:message});
			})
			.catch(error => {
				self.fetching = false;
				self.ready = true;
				self.errorMessage = error;
				self.notifyAll({model:self.name, method:'fetched', status:status, message:error});
			});
	}
}
