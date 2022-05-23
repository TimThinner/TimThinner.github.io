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
			
			const json = this.modelRepo.get('JSONReaderModel').json();
			console.log(['JSON fetched json=',json]);
			
			setTimeout(() => 
				this.modelRepo.get('JSONReaderModel').get({type:'connector',name:"Luke's Farm"});
			, 1000);
			
			
		} else if (options.model==='JSONReaderModel' && options.method==='get' && options.type==='connector') {
			
			const resu = this.modelRepo.get('JSONReaderModel').result();
			console.log(['JSON get connector data=',resu]);
		}
	}
	
	init() {
		console.log('Create JSONReaderModel');
		const JSONRM = new JSONReaderModel({name:'JSONReaderModel',src:'db.json'});
		this.modelRepo.add('JSONReaderModel',JSONRM);
		JSONRM.subscribe(this); // Now we will receive notifications from the JSONReaderModel
		JSONRM.fetch(); // Just call PCM.fetch() anytime to clean the proxy cache!
	}
}
new MasterController().init();
