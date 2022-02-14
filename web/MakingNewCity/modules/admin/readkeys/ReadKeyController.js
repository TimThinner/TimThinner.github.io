import Controller from '../../common/Controller.js';
import ReadKeyModel from  './ReadKeyModel.js';
import ReadKeyView from './ReadKeyView.js';

export default class ReadKeyController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	/*
	PeriodicPoller is not used anymore. Controller does not extend PeriodicPoller.
	Today we handle poller in View or in Controller, depending on case.
	
	
	For example ABCView:
	
	constructor(controller) {
		super(controller);
		
		
		this.PTO = new PeriodicTimeoutObserver({interval:10000}); // interval 10 seconds
		this.PTO.subscribe(this);
		
	
	show() {
		this.render();
		this.tickcount = 0;
		this.PTO.restart();
	}
	
	hide() {
		this.PTO.stop();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.PTO.stop();
		this.PTO.unsubscribe(this);
			
			
			
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				// do the show (render) stuff.
				
			} else if (options.model==='PeriodicTimeoutObserver' && options.method==='timeout') {
				
				// do the fetch stuff.
			}
		}
	}
	*/
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		this.models = {};
	}
	
	initialize() {
		// ReadKeyModel is now created at UsersController.
		this.models['ReadKeyModel'] = this.master.modelRepo.get('ReadKeyModel');
		this.models['ReadKeyModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new ReadKeyView(this);
	}
	
	clean() {
		console.log('ReadKeyController is now REALLY cleaned!');
		this.remove();
		/* IN Controller:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		// AND in this.remove finally all models created here is removed.
		// So we need to do init() almost in its entirety again ... timers are NOT deleted in remove, 
		// so there is no need to redefine them.
		this.initialize();
	}
	
	init() {
		this.initialize();
		//this.timers['ReadKeyModel'] = {timer: undefined, interval: -1, models:['ReadKeyModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
