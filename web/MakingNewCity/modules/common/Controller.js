
export default class Controller {
	
	constructor(options) {
		
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.models = {};
		this.view   = undefined;
		// Allow navigation from different views to one view and then back.
		this.returnAddress = undefined;
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
	}
	
	hide() {
		console.log(['HIDE CONTROLLER ',this.name]);
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		console.log(['SHOW CONTROLLER ',this.name]);
		if (this.visible && this.view) {
			console.log('CONTROLLER SHOW');
			this.view.show();
		}
	}
	
	/*
	To do:
	
	Only some controllers really need to be wiped clean!
	They have they own clean() -method. See: UserPageController.
	*/
	
	clean() {
		//console.log(this.name + ' is now cleaned!');
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
					this.restore();
					this.show();
				}, 100);
			} else {
				this.visible = false;
				this.hide();
			}
		}
	}
	
	forceLogout() {
		this.master.forceLogout();
	}
	
	restore() {
		console.log('Controller restore');
	}
}
