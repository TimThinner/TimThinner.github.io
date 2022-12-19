import View from '../common/View.js';
/*
	If not logged in:
		email + password input fields
		CANCEL-button AND LOGIN-button
		
		Signup link => signup page...
			email + password input fields
			CANCEL-button AND SIGNUP-button
		
		
	If logged in => Account info + logout
		Account INFO
		CANCEL-button AND LOGOUT-button
*/
export default class UserView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.rendered = false;
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
}
