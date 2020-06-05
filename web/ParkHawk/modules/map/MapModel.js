import EventObserver from '../common/EventObserver.js';

export default class MapModel extends EventObserver {
	
	constructor(options) {
		super();
		
		this.name = options.name;
		this.src = options.src;
		
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	}
	
	flattenStopData(allstops) {
		console.log(['flattenStopData allstops=',allstops]);
		let newDepartureInformation = [];
		let newAllStops = [];
		let depSort = function (a, b) {
			return a.serviceDay - b.serviceDay || a.departureTime - b.departureTime;
		};
		for (let stop of allstops) {
			let newStop = {
				latlng: L.latLng(stop.lat, stop.lon),
				name: stop.name,
				priority: stop.priority
			};
			newStop.departureInformation = [];
			for (let departure of stop.stoptimesForPatterns) {
				for (let departureTime of departure.stoptimes) {
					let dep = {};
					dep.stopId = stop.gtfsId;
					dep.stopName = stop.name;
					dep.stopLocation = {lat: stop.lat, lon: stop.lon};
					dep.headsign = departure.pattern.headsign;
					dep.routeName = departure.pattern.route.longName;
					dep.shortName = departure.pattern.route.shortName;
					dep.departureTime = departureTime.scheduledDeparture;
					dep.serviceDay = departureTime.serviceDay;
					let depHr = Math.floor(departureTime.scheduledDeparture / 60 / 60);
					let depMin = Math.round((departureTime.scheduledDeparture / 60 / 60 - depHr) * 60);
					if (depMin < 10) {
						depMin = '0' + depMin;
					}
					dep.departureString = (depHr + ':' + depMin);
					newDepartureInformation.push(dep);
					newStop.departureInformation.push(dep);
				}
			}
			newStop.departureInformation.sort(depSort);
			newAllStops.push(newStop);
		}
		newDepartureInformation.sort(depSort);
		return { allStops: newAllStops, allDepInfo: newDepartureInformation }
	}
	
	fetch() {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		console.log ('MapModel => fetch()...');
		const message = 'OK';
		
		/*
		setTimeout(() => {
			status = 200; // OK
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:status, message:'OK'});
		}, 200);
		*/
		
		/*
		this.targets = {'Nuuksio':{
			logo: './img/401px-Nuuksion_kp.png',
			zoom: 11,
			center: [60.32, 24.54],
			busStops: {
				routingUrl: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
				routingAreas: [
					{ lat: 60.270, lng: 24.594, radius: 3200 },
					{ lat: 60.2695, lng: 24.4440, radius: 300 },
					{ lat: 60.283, lng: 24.511, radius: 1600 },
					{ lat: 60.310, lng: 24.546, radius: 3000 },
					{ lat: 60.324, lng: 24.5, radius: 1300 }
				]
			},*/
		
		
		const routingUrl = this.src.targets[this.src.activeTarget].busStops.routingUrl;
		let busStops = [];
		let i=1;
		let queryString = '{';
		this.src.targets[this.src.activeTarget].busStops.routingAreas.forEach(a => {
			queryString += 'stopsByRadius'+i+':stopsByRadius(lat:'+a.lat+',lon:'+a.lng+',radius:'+a.radius+') {';
			queryString += '  edges {';
			queryString += '    node {';
			queryString += '      distance';
			queryString += '      stop {';
			queryString += '        gtfsId';
			queryString += '        name';
			queryString += '        lat';
			queryString += '        lon';
			queryString += '        stoptimesForPatterns {';
			queryString += '          pattern {';
			queryString += '            headsign';
			queryString += '            name';
			queryString += '            route {';
			queryString += '              gtfsId';
			queryString += '              shortName';
			queryString += '              longName';
			queryString += '            }';
			queryString += '          }';
			queryString += '          stoptimes {';
			queryString += '            scheduledDeparture';
			queryString += '            headsign';
			queryString += '            serviceDay';
			queryString += '          }';
			queryString += '        }';
			queryString += '      }';
			queryString += '    }';
			queryString += '  }';
			queryString += '}';
			i++;
		});
		queryString += '}';
		//console.log(['queryString=',queryString]);
		
		let req = {
			query: queryString
		};
		fetch(routingUrl, {
			method: 'POST',
			body: JSON.stringify(req),
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(function(response) {
			//console.log(['GraphQL RESPONSE IS: ',response]);
			status = response.status;
			return response.json();
		}).then(function(myJson) {
			//console.log(['GraphQL JSON RESPONSE IS: ',myJson]);
			self.fetching = false;
			self.ready = true;
			
			function compareDepTime(a, b) {
				if (a.stoptimesForPatterns[0] && a.stoptimesForPatterns[0].stoptimes[0] && b.stoptimesForPatterns[0] && b.stoptimesForPatterns[0].stoptimes[0]) {
					let aa = a.stoptimesForPatterns[0].stoptimes[0].scheduledDeparture + a.stoptimesForPatterns[0].stoptimes[0].serviceDay;
					let bb = b.stoptimesForPatterns[0].stoptimes[0].scheduledDeparture + b.stoptimesForPatterns[0].stoptimes[0].serviceDay;
					if (aa < bb) { return -1; }
					if (aa > bb) { return 1;  }
				}
				return 0;
			}
			
			if (myJson.data) {
				Object.keys(myJson.data).forEach(key => {
					for (let edge of myJson.data[key].edges) {
						if (edge && edge.node) {
							busStops.push(edge.node.stop);
						}
					}
				});
			}
			console.log(['busStops=',busStops]);
			
			// Sort stops
			busStops.sort(compareDepTime);
			
			let stopNames = [];
			// Set priority for rendering
			// and collect all unique bus stop names into array
			for (let stop of busStops) {
				if (['Kattila','Haukkalammentie','Haltia','Siikaniemi','Siikaranta','Veikkola','Gumbölenristi'].includes(stop.name)) {
					stop.priority = 1;
				} else {
					stop.priority = 0;
				}
				if (!(stopNames.includes(stop.name))) {
					stopNames.push(stop.name);
				}
			}
			stopNames.sort();
			console.log(['stopNames=',stopNames]);
			
			const newStopObject = self.flattenStopData(busStops);
			const BSD = {
				stopnames: stopNames,
				stops: newStopObject.allStops,
				alldepartures: newStopObject.allDepInfo
			};
			console.log(['BSD=',BSD]);
			//this.props.storeBusStops(BSD);
			
			self.notifyAll({model:'MapModel',method:'fetched',status:status,message:message});
		})
		.catch(function(error) {
			self.fetching = false;
			self.ready = true;
			self.errorMessage = error;
			self.notifyAll({model:'MapModel',method:'fetched',status:status,message:error});
		});
	}
}
