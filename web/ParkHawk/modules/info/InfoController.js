import InfoView from './InfoView.js';
export default class InfoController {
	
	constructor(options) {
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.appDataModel = this.master.modelRepo.get('AppDataModel');
		this.appDataModel.subscribe(this);
		
		this.view = undefined;
	}
	
	remove() {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		this.appDataModel.unsubscribe(this);
	}
	
	hide() {
		if (this.view) {
			this.view.hide();
		}
	}
	
	show() {
		console.log('InfoView Show!!');
		if (this.visible && this.view) {
			this.view.show();
		}
	}
	
	restore() {
		console.log('InfoController restore');
	}
	
	notify(options) {
		if (options.model==='AppDataModel' && (options.method==='tabselected' || options.method==='restored')) {
			console.log(['Open tab ',options.tab]);
			if (this.name === options.tab) {
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
	
	init() {
		console.log('InfoController Init');
		this.view = new InfoView(this);
	}
}
