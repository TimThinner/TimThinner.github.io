import Model from './Model.js';

export default class FeedbackModel extends Model {
	
	constructor(options) {
		super(options);
		this.feedbacks = [];
	}
	
	fetch(token) {
		const self = this;
		
		if (this.fetching) {
			console.log(this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		if (this.MOCKUP) {
			this.errorMessage = '';
			this.fetching = true;
			setTimeout(() => {
				this.feedbacks = [
{"_id":"5f75d04e251f6e38b8a6a735","userId":"5f75d04e251f6e38b8a6a800","feedbackType":"heating","created":"2020-11-18T10:00:00.000Z","feedback":1},
{"_id":"5f75d04e251f6e38b8a6a736","userId":"5f75d04e251f6e38b8a6a800","feedbackType":"heating","created":"2020-11-18T11:00:00.000Z","feedback":2},
{"_id":"5f75d04e251f6e38b8a6a737","userId":"5f75d04e251f6e38b8a6a800","feedbackType":"heating","created":"2020-11-18T12:00:00.000Z","feedback":3}
				];
				this.fetching = false;
				this.ready = true;
				this.notifyAll({model:this.name, method:'fetched', status:200, message:'OK'});
			}, 200);
			
		} else {
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
	}
	
	send(data, token) {
		const self = this;
		console.log(['SENDING FEEDBACK: user=',data.refToUser,' type=', data.feedbackType,' feedback=',data.feedback]);
		if (this.MOCKUP) {
			
			const msg = 'Feedback submitted OK';
			setTimeout(() => this.notifyAll({model:'FeedbackModel',method:'send',status:200,message:msg}), 100);
			
		} else {
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
}
