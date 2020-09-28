import PeriodicPoller from '../common/PeriodicPoller.js';

export default class Controller extends PeriodicPoller {
	
	/*
	Timers are used to fetch (update) data periodically.
	Timers are owned by Controller, and any Controller can initialize one or more timers
	using a syntax like this:
	
	this.timers['DistrictAView'] = {timer: undefined, interval: 30000, models:['StatusModel']};
	
	If there are many charts in one view, a Controller creates a WrapperView, which holds all subviews.
	It is important to notice here that one chart can display data from multiple models, but one chart 
	can have only one timer.
	*/
	
	constructor(options) {
		super(options);
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.models = {};
		this.view   = undefined;
	}
	
	remove() {
		super.remove();
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
	}
	
	hide() {
		super.hide();
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		if (this.visible && this.view) {
			this.view.show();
			// Start polling all timers for THIS CONTROLLER:
			this.startPollers();
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
