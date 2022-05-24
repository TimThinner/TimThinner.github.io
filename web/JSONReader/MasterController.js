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
				rm.findR(rm.json.connectors, "ids:connector");
			}, 1000);
			
		} else if (options.model==='JSONReaderModel' && options.method==='found') {
			
			const rm = this.JSONReader;
			console.log(['JSON get connector result=',rm.result]);
			// rm.result is an array of elements if they were found.
			if (rm.result.length > 0) {
				if (options.type === 'ids:connector') {
					console.log(['CONNECTORS rm.result=',rm.result]);
					const cid = rm.result[0]["@id"];
					// Get Catalogs from first connector
					setTimeout(() => {
						rm.findR(rm.json.connectors, "ids:ResourceCatalog", cid);
					}, 1000);
				} else if (options.type === 'ids:ResourceCatalog') {
					console.log(['CATALOGS rm.result=',rm.result]);
				}
			}
		}
	}
	
	init() {
		console.log('Create JSONReaderModel');
		this.JSONReader = new JSONReaderModel({name:'JSONReaderModel',src:'db.json'});
		this.JSONReader.subscribe(this); // Now we will receive notifications from the JSONReaderModel
		this.JSONReader.fetch(); // Fetch the JSON.
	}
}
new MasterController().init();
