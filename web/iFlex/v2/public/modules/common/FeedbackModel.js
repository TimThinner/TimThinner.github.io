import Model from './Model.js';

export default class FeedbackModel extends Model {
	
	constructor(options) {
		super(options);
		this.feedbacks = [];
	}
	
	fetch(po) {
		const self = this;
		const token = po.token;
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.errorMessage = '';
		this.fetching = true;
		
		let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		
		const url = this.mongoBackend + '/feedbacks';
		fetch(url, {headers: myHeaders})
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				console.log(['myJson=',myJson]);
				self.feedbacks = myJson.feedbacks;
				console.log(['self.feedbacks=',self.feedbacks]);
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
	}
	
	send(data, token) {
		const self = this;
		//console.log(['SENDING FEEDBACK: user=',data.refToUser,' type=', data.feedbackType,' feedback=',data.feedback]);
		// Add authorizatoin headers to this call.
		const myHeaders = new Headers();
		const authorizationToken = 'Bearer '+token;
		myHeaders.append("Authorization", authorizationToken);
		myHeaders.append("Content-Type", "application/json");
		
		const myPost = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		};
		const url = this.mongoBackend + '/feedbacks/';
		const myRequest = new Request(url, myPost);
		let status = 500; // RESPONSE (OK: 200, Auth Failed: 401, error: 500)
		fetch(myRequest)
			.then(function(response) {
				status = response.status;
				return response.json();
			})
			.then(function(myJson) {
				const message = myJson.message;
				self.notifyAll({model:'FeedbackModel',method:'send',status:status,message:message});
			})
			.catch(function(error) {
				self.notifyAll({model:'FeedbackModel',method:'send',status:status,message:error});
			});
	}
}
