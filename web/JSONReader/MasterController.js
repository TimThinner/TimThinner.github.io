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
		this.JSONReader = undefined;
	}
	
	notify(options) {
		if (options.model==='JSONReaderModel' && options.method==='fetched') {
			
			const rm = this.JSONReader;
			console.log(['JSON fetched json=',rm.json]);
			setTimeout(() => {
				//rm.getAllIds();
				rm.getAll();
			}, 1000);
			
			
			//setTimeout(() => {
				//rm.get({type:'connector',title:"Luke's Farm"});
			//}, 1000);
			
			
		} else if (options.model==='JSONReaderModel' && options.method==='getAllIds') {
			
			const rm = this.JSONReader;
			console.log(['JSON get connector result=',rm.result]);
			
			//setTimeout(() => {
				//rm.get({type:'connector',title:"Luke's Farm"});
			//}, 1000);
			
			
			
		}
		
		// List "catalogs" for specific "connector"...
		
		// List "ids:offeredResource"s  for specific "catalog"...
		// How do we maintain the path to element...
	}
	
	init() {
		console.log('Create JSONReaderModel');
		this.JSONReader = new JSONReaderModel({name:'JSONReaderModel',src:'db.json'});
		this.JSONReader.subscribe(this); // Now we will receive notifications from the JSONReaderModel
		this.JSONReader.fetch(); // Fetch the JSON.
	}
}
new MasterController().init();
