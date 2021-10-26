import Model from '../../common/Model.js';
/*
	
	
	Model has following properties  + it extends EventObserver
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	}
	fetch() {
		console.log('DUMMY FETCH!');
		this.ready = true;
	}
*/
export default class UsersModel extends Model {
	
	constructor(options) {
		super(options);
		this.users = [];
		this.selected = undefined;
	}
	
	setSelected(sel) {
		this.selected = sel;
	}
	
	getSelected() {
		return this.selected;
	}
	
	fetch(token) {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		if (this.MOCKUP) {
			setTimeout(() => {
				this.users = [];
			/*
				{"_id":"5f75cff0251f6e38b8a6a733","email":"timo.kinnunen@vtt.fi","created":"2020-10-01T12:47:44.259Z"},
				{"_id":"5f75d010251f6e38b8a6a734","email":"sivakka@vtt.fi","created":"2020-10-01T12:48:16.411Z"},
				{"_id":"5f75d08b251f6e38b8a6a737","email":"snoopy@vtt.fi","created":"2020-10-01T12:50:19.865Z",
"regcode":{"_id":"5f75d04e251f6e38b8a6a735","email":"snoopy@vtt.fi","apartmentId":"123","code":"fzyjw6","startdate":"2020-09-30T21:00:00.000Z","enddate":"2020-12-31T22:00:00.000Z","__v":0},
"readkey":{"_id":"5f75d08b251f6e38b8a6a736","startdate":"2020-09-30T21:00:00.000Z","enddate":"2020-12-31T22:00:00.000Z","__v":0}
				}
			];*/
				this.fetching = false;
				this.ready = true;
				this.notifyAll({model:this.name, method:'fetched', status:200, message:'OK'});
				
			}, 200);
			
		} else {
			let status = 500; // (OK: 200, AUTH FAILED: 401, error: 500)
			this.errorMessage = '';
			this.fetching = true;
			
			const myHeaders = new Headers();
			const authorizationToken = 'Bearer '+token;
			myHeaders.append("Authorization", authorizationToken);
			
			const url = this.mongoBackend + '/users';
			fetch(url, {headers: myHeaders})
				.then(function(response) {
					status = response.status;
					return response.json();
				})
				.then(function(myJson) {
					//console.log(['myJson=',myJson]);
					self.users = myJson.users;
					console.log(['self.users=',self.users]);
					self.fetching = false;
					self.ready = true;
					let message = 'OK';
					if (typeof self.users.message !== 'undefined') {
						message = self.users.message;
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
}
