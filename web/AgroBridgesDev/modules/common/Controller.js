export default class Controller {
	
	constructor(options) {
		
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.models  = {};
		this.view    = undefined;
		this.context = undefined;
	}
	
	remove() {
		console.log(['REMOVE CONTROLLER ',this.name]);
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		this.visible = false;
	}
	
	hide() {
		//console.log(['HIDE CONTROLLER ',this.name]);
		if (this.view) {
			this.view.hide();
		}
		this.visible = false;
	}
	// NOTE: Views can share models, which can hold data from different timeranges.
	// So it is important to make sure that before polling starts we have right parameters 
	// set at the models.
	show() {
		//console.log(['SHOW CONTROLLER ',this.name]);
		if (this.visible && this.view) {
			console.log('Show the VIEW...');
			this.view.show();
		}
	}
	
	/*
	Only some controllers really need to be wiped clean (=reset models)!
	They have they own clean() -method. This is the default operation.
	*/
	clean() {
		console.log(this.name + ' DUMMY clean!');
	}
	
	/*
		Every Controller must subscribe for "MenuModel" notifications.
		After that all view changes are driven by this code. Note that by using 
		timeout we make all other "VIEWS" hidden before showing the selected one.
	*/
	notify(options) {
		if (options.model==='MenuModel' && options.method==='selected') {
			//console.log(['In ',this.name,' selected = ',options.selected]);
			if (this.name === options.selected) {
				setTimeout(() => {
					this.visible = true;
					this.show();
				}, 100);
			} else {
				this.hide();
			}
		}
	}
	
	forceLogout() {
		this.master.forceLogout();
	}
}
