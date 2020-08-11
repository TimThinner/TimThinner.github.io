import EggView from './EggView.js';

export default class EggController {
	
	
	// new EggController({name:'EGG', master:this, el:'#content', visible:true});
	constructor(options) {
		
		this.name    = options.name;
		this.master  = options.master;
		this.visible = options.visible;
		this.el      = options.el;
		
		this.view = undefined;
	}
	
	init() {
		this.view = new EggView(this);
		//this.view.show();
	}
}
//new EggController().init();
