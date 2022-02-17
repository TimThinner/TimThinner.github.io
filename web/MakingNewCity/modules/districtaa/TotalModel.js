import FeedModel from '../common/FeedModel.js';
/*

https://makingcity.vtt.fi/data/arina/iss/feeds.json?meterId=114&start=2020-02-12&end=2020-02-12


[{"created_at":"2020-02-10T00:01:06","meterId":114,"averagePower":28.8,"totalEnergy":451145,"energyDiff":0.6},
{"created_at":"2020-02-10T00:02:18","meterId":114,"averagePower":35,"totalEnergy":451145.7,"energyDiff":0.7},
{"created_at":"2020-02-10T00:03:34","meterId":114,"averagePower":28.421,"totalEnergy":451146.3,"energyDiff":0.6},

...

{"created_at":"2020-02-10T14:02:00","meterId":114,"averagePower":83.836,"totalEnergy":451889.4,"energyDiff":1.7},
{"created_at":"2020-02-10T14:03:19","meterId":114,"averagePower":82.025,"totalEnergy":451891.2,"energyDiff":1.8},
{"created_at":"2020-02-10T14:04:33","meterId":114,"averagePower":48.649,"totalEnergy":451892.2,"energyDiff":1},
{"created_at":"2020-02-10T14:05:51","meterId":114,"averagePower":50.769,"totalEnergy":451893.3,"energyDiff":1.1}
]
*/
export default class TotalModel extends FeedModel {
	constructor(options) {
		super(options);
	}
}
