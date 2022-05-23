import ModelRepo from './modules/common/ModelRepo.js';
import JSONReaderModel from './modules/common/JSONReaderModel.js';
/*
	"connectors": [
		"ids:title" : ["Luke's Farm"],
		"catalogs": [ 
			"ids:title" : ["Drone Missions"],
			"ids:offeredResource": [
				"ids:title" : ["PestSurveyMission_2206_01_PlotA"],
				"ids:representation": [
					
					"ids:instance": [
*/
class MasterController {
	
	constructor() {
		//this.controllers = {};
		this.modelRepo = new ModelRepo();
	}
	
	notify(options) {
		if (options.model==='JSONReaderModel' && options.method==='fetched') {
			
			const rm = this.modelRepo.get('JSONReaderModel');
			if (rm) {
				console.log(['JSON fetched json=',rm.json]);
				setTimeout(() => {
					rm.get({type:'connector',title:"Luke's Farm"});
				}, 1000);
			}
			
		} else if (options.model==='JSONReaderModel' && options.method==='get' && options.type==='connector') {
			
			const rm = this.modelRepo.get('JSONReaderModel');
			if (rm) {
				console.log(['JSON get connector data=',rm.result]);
			}
		}
	}
	
	init() {
		console.log('Create JSONReaderModel');
		const JSONRM = new JSONReaderModel({name:'JSONReaderModel',src:'db.json'});
		this.modelRepo.add('JSONReaderModel',JSONRM);
		JSONRM.subscribe(this); // Now we will receive notifications from the JSONReaderModel
		JSONRM.fetch(); // Fetch the JSON.
	}
}
new MasterController().init();
