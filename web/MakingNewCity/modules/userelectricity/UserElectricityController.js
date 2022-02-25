import Controller from '../common/Controller.js';
import UserElectricityModel from './UserElectricityModel.js';
import UserElectricityView from './UserElectricityView.js';

export default class UserElectricityController extends Controller {
	
	constructor(options) {
		super(options);
		this.numOfDays = 30;
		
	}
	
	remove() {
		/* IN Controller:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		super.remove();
		// We must remove all models that were created here at the init-method.
		for (let i=0; i<this.numOfDays; i++) {
			const key = 'UserElectricity'+i+'Model';
			console.log(['remove ',key,' from the REPO']);
			this.master.modelRepo.remove(key);
		}
		this.models = {};
	}
	
	clean() {
		console.log('UserElectricityController is now REALLY cleaned!');
		this.remove();
		this.init();
	}
	
	init() {
		// ends defines the moment subtracted from now.
		// starts is then substracted from end to create a short timerange just to get one (last) value close to end moment.
		// During 10 minutes there should be 10 values, and we get the last one.
		/*
		const nowTR = {ends:{value:10,unit:'seconds'},starts:{value:10,unit:'minutes'}};
		const dayTR = {ends:{value:24,unit:'hours'},starts:{value:10,unit:'minutes'}};
		const weekTR = {ends:{value:7,unit:'days'},starts:{value:10,unit:'minutes'}};
		const monthTR = {ends:{value:1,unit:'months'},starts:{value:10,unit:'minutes'}};
		*/
		// NOTE: There was a (60 hours) break in test data service between:
		//		Last timestamp: created_at "2022-01-22T01:59:35"
		//		First timestamp  created_at "2022-01-24T14:24:35"
		// So try this again at 24.2.2022 at around 14:30!!!
		// Between 22.2.2022 02:00 - 24.2.2022 14:25 we get "No data!" response.
		/*
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
		*/
		
		
		
		
		
		
		
		
		// NOTE: Range is created dynamically at each fetching cycle.
		const model_data = [];
		for (let i=0; i<this.numOfDays; i++) {
			model_data.push({name:'UserElectricity'+i+'Model',range:i});
		}
		model_data.forEach(md => {
			const m = new UserElectricityModel({
				name: md.name,
				src: 'data/sivakka/apartments/feeds.json',
				type: 'energy',
				limit: 1,
				range: md.range
			});
			m.subscribe(this);
			this.master.modelRepo.add(md.name, m);
			this.models[md.name] = m;
		});
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserElectricityView(this);
	}
}
