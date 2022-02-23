import Controller from '../common/Controller.js';
import UserApartmentModel from '../userpage/UserApartmentModel.js';
import UserElectricityView from './UserElectricityView.js';

export default class UserElectricityController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserElectricityNowModel' || 
				key === 'UserElectricityDayModel' || 
				key === 'UserElectricityWeekModel' || 
				key === 'UserElectricityMonthModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	clean() {
		console.log('UserElectricityController is now REALLY cleaned!');
		this.remove();
		/* IN PeriodicPoller:
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
		*/
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
		this.init();
	}
	
	init() {
		// ends defines the moment subtracted from now.
		// starts is then substracted from end to create a short timerange just to get one (last) value close to end moment.
		const nowTR = {ends:{value:10,unit:'seconds'},starts:{value:2,unit:'minutes'}};
		const dayTR = {ends:{value:24,unit:'hours'},starts:{value:2,unit:'minutes'}};
		const weekTR = {ends:{value:7,unit:'days'},starts:{value:2,unit:'minutes'}};
		const monthTR = {ends:{value:1,unit:'months'},starts:{value:2,unit:'minutes'}};
		
		const model_EleNow = new UserApartmentModel({name:'UserElectricityNowModel',src:'data/sivakka/apartments/feeds.json',type:'energy',limit:1,range:nowTR});
		model_EleNow.subscribe(this);
		this.master.modelRepo.add('UserElectricityNowModel',model_EleNow);
		this.models['UserElectricityNowModel'] = model_EleNow;
		
		const model_EleDay = new UserApartmentModel({name:'UserElectricityDayModel',src:'data/sivakka/apartments/feeds.json',type:'energy',limit:1,range:dayTR});
		model_EleDay.subscribe(this);
		this.master.modelRepo.add('UserElectricityDayModel',model_EleDay);
		this.models['UserElectricityDayModel'] = model_EleDay;
		
		const model_EleWeek = new UserApartmentModel({name:'UserElectricityWeekModel',src:'data/sivakka/apartments/feeds.json',type:'energy',limit:1,range:weekTR});
		model_EleWeek.subscribe(this);
		this.master.modelRepo.add('UserElectricityWeekModel',model_EleWeek);
		this.models['UserElectricityWeekModel'] = model_EleWeek;
		
		const model_EleMonth = new UserApartmentModel({name:'UserElectricityMonthModel',src:'data/sivakka/apartments/feeds.json',type:'energy',limit:1,range:monthTR});
		model_EleMonth.subscribe(this);
		this.master.modelRepo.add('UserElectricityMonthModel',model_EleMonth);
		this.models['UserElectricityMonthModel'] = model_EleMonth;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserElectricityView(this);
	}
}
