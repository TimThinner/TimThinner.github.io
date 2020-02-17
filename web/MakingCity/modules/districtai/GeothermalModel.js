import FeedModel from '../common/FeedModel.js';
/*
	https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=116&limit=1440&start=2020-02-12&end=2020-02-12
	
	{"created_at":"2020-02-12T00:24:02","meterId":116,"averagePower":0,"totalEnergy":342.45,"energyDiff":0},
	{"created_at":"2020-02-12T00:25:18","meterId":116,"averagePower":0,"totalEnergy":342.45,"energyDiff":0},
	{"created_at":"2020-02-12T00:26:31","meterId":116,"averagePower":0,"totalEnergy":342.45,"energyDiff":0},
	{"created_at":"2020-02-12T00:27:45","meterId":116,"averagePower":0.486,"totalEnergy":342.46,"energyDiff":0.01}, ...
	
	115		Geothermal energy	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today	
*/
export default class GeothermalModel extends FeedModel {
	
	constructor(options) {
		super(options);
	}
}