import FeedModel from '../common/FeedModel.js';
/*
	https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=102&start=2020-02-12&end=2020-02-12
	https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=103&start=2020-02-12&end=2020-02-12
	https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=104&start=2020-02-12&end=2020-02-12
	https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=110&start=2020-02-12&end=2020-02-12
	
	{"created_at":"2020-02-12T00:24:02","meterId":116,"averagePower":0,"totalEnergy":342.45,"energyDiff":0},
	{"created_at":"2020-02-12T00:25:18","meterId":116,"averagePower":0,"totalEnergy":342.45,"energyDiff":0},
	{"created_at":"2020-02-12T00:26:31","meterId":116,"averagePower":0,"totalEnergy":342.45,"energyDiff":0},
	{"created_at":"2020-02-12T00:27:45","meterId":116,"averagePower":0.486,"totalEnergy":342.46,"energyDiff":0.01}, ...
	
	
		HPAC				2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								2 coloured values in same chart:
101								HPAC (JK_101)
105								HPAC (JK_102)

*/
export class HPAC101Model extends FeedModel {
	
	constructor(options) {
		super(options);
	}
}
export class HPAC105Model extends FeedModel {
	
	constructor(options) {
		super(options);
	}
}
