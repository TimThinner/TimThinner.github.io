import Controller from '../../common/Controller.js';
import ConfigModel from  '../../common/ConfigModel.js';
import ConfigsView from './ConfigsView.js';

export default class ConfigsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		this.models = {};
	}
	
	clean() {
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
		this.init();
	}
	
	init() {
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.models['ConfigModel'] = this.master.modelRepo.get('ConfigModel');
		this.models['ConfigModel'].subscribe(this);
		
		this.view = new ConfigsView(this);
	}
}
