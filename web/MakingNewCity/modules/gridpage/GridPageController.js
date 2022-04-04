import Controller from '../common/Controller.js';
import EmpoModel from  '../environmentpage/EmpoModel.js';
import GridPageView from './GridPageView.js';
/*
Electricity production in Finland
This data retrieves the electricity production from all powerplants.
Variable Id 192
Data Period 3 min
Unit MW

Electricity consumption in Finland
This data retrieves the electricity consumption.
Variable Id 193
Data Period 3 min
Unit MW

Nuclear power production
Variable Id 188
Data Period 3 min

Hydro power production
Hydro power production in Finland based on the real-time measurements in Fingrid's operation control system. 
Variable Id 191
The data is updated every 3 minutes

Power system state - real time data
Different states of the power system - traffic lights: 1=green, 2=yellow, 3=red, 4=black, 5=blue
- Green: Power system is in normal secure state.
- Yellow: Power system is in endangered state. The adequacy of the electricity is endangered or the power system doesn't fulfill the security standards.
- Red: Power system is in disturbed state. Load shedding has happened in order to keep the adequacy and security of the power system or there is a remarkable risk to a wide black out.
- Black: An extremely serious disturbance or a wide black out in Finland.
- Blue: The network is being restored after an extremely serious disturbance or a wide blackout
Variable Id 209
Data Period 3 min

Wind power production
Variable Id 181
Data Period 3 min

Condensing power production
Variable Id 189
Data Period 3 min

Other production inc. estimated small-scale production and reserve power plants
Variable Id 205
Data Period 3 min

Industrial cogeneration
Variable Id 202
Data Period 3 min

Cogeneration of district heating
Variable Id 201
Data Period 3 min

Solar power
Solar power generation forecast - updated hourly
Variable Id 248
Data Period 1 hour

Transmission between Finland and Central Sweden
Variable Id 89
Data Period 3 min

Transmission between Finland and Estonia
Variable Id 180
Data Period 3 min

Transmission between Finland and Northern Sweden
Variable Id 87
Data Period 3 min

Transmission between Finland and Russia
Variable Id 195
Data Period 3 min

Transmission between Finland and Norway
Variable Id 187
Data Period 3 min

NEW: Use EntsoeModel to get electricity price forecast.



case 'Finland'		idomain = '10YFI-1--------U'	Finland, Fingrid BZ / CA / MBA


*/
import FingridModel from  '../energydata/FingridModel.js';
import EntsoeModel from '../energydata/EntsoeModel.js';

export default class GridPageController extends Controller {
	
	constructor(options) {
		super(options);
		this.variable_ids = ['192','193','188','191','181','205','202','201','89','180','87','195','187']; // 13
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		Object.keys(this.models).forEach(key => {
			if (key === 'Fingrid192Model' || key === 'Fingrid193Model' ||
				key === 'Fingrid188Model' || key === 'Fingrid191Model' ||
				key === 'Fingrid181Model' || key === 'Fingrid205Model' ||
				key === 'Fingrid202Model' || key === 'Fingrid201Model' ||
				key === 'Fingrid89Model' || key === 'Fingrid180Model' ||
				key === 'Fingrid87Model' || key === 'Fingrid195Model' ||
				key === 'Fingrid187Model' || key === 'EntsoeEnergyPriceModel') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	init() {
		this.variable_ids.forEach(id=> {
			const model_name = 'Fingrid'+id+'Model';
			const m = new FingridModel({name:model_name,src:'https://api.fingrid.fi/v1/variable/'+id+'/event/json'});
			m.subscribe(this);
			this.master.modelRepo.add(model_name,m);
			this.models[model_name] = m;
		});
		
		const entsoe_model = new EntsoeModel({name:'EntsoeEnergyPriceModel',src:'https://transparency.entsoe.eu/api', document_type:'A44', area_name:'Finland'});
		entsoe_model.subscribe(this);
		this.master.modelRepo.add('EntsoeEnergyPriceModel',entsoe_model);
		this.models['EntsoeEnergyPriceModel'] = entsoe_model;
		
		this.models['FingridPowerSystemStateModel'] = this.master.modelRepo.get('FingridPowerSystemStateModel');
		this.models['FingridPowerSystemStateModel'].subscribe(this);
		
		
		/*
		We need two EmpoModels:
		1. start 
		2. 
		
		const model_data = [];
		for (let i=1; i<this.numOfEmpoModels+1; i++) {
			const sh = i*24;
			const eh = i*24-24;
			model_data.push({name:'EmpoEmissions'+i+'Model',sh:sh,eh:eh});
		}
		model_data.forEach(md => {
			const em = new EmpoModel({
				name: md.name,
				src: 'emissions/findByDate?country=FI&EmDB=EcoInvent',
				timerange_start_subtract_hours: md.sh,
				timerange_end_subtract_hours: md.eh
			});
			em.subscribe(this);
			this.master.modelRepo.add(md.name, em);
			this.models[md.name] = em;
		*/
		const mElevenHours = new EmpoModel({
				name: 'EmpoEmissionsElevenHours',
				src: 'emissions/findByDate?country=FI&EmDB=EcoInvent',
				timerange_start_subtract_hours: 11,
				timerange_end_subtract_hours: 0
			});
		mElevenHours.subscribe(this);
		this.master.modelRepo.add('EmpoEmissionsElevenHours', mElevenHours);
		this.models['EmpoEmissionsElevenHours'] = mElevenHours;
		
		const mFiveDays = new EmpoModel({
				name: 'EmpoEmissionsFiveDays',
				src: 'emissions/findByDate?country=FI&EmDB=EcoInvent',
				timerange_start_subtract_hours: 131, // 120 + 11
				timerange_end_subtract_hours: 0
			});
		mFiveDays.subscribe(this);
		this.master.modelRepo.add('EmpoEmissionsFiveDays', mFiveDays);
		this.models['EmpoEmissionsFiveDays'] = mFiveDays;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new GridPageView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
