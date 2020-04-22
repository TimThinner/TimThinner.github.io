import Controller from '../common/Controller.js';
import DistrictModel from  './DistrictModel.js';
import DistrictView from './DistrictView.js';

export default class DistrictController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		const model = new DistrictModel({name:'DistrictModel',src:'district'});
		model.subscribe(this);
		this.master.modelRepo.add('DistrictModel',model);
		this.models['DistrictModel'] = model;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictView(this);
	}
}
