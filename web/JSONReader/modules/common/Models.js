import Model from './Model.js';

export class ConnectorModel extends Model {
	constructor(options) {
		super(options);
		this.type = 'ids:connector';  // "@type": "ids:connector",
		this.id = undefined;          // "@id"  : "https://url-of-this-connector-api/1",
		this.title = undefined;       // "ids:title" : ["Luke's Farm"],
		this.description = undefined; // "ids:description": ["Description of connector"],
		this.catalogs = [];           // "catalogs": [ 
	}
}

export class CatalogModel extends Model {
	constructor(options) {
		super(options);
		this.type = 'ids:ResourceCatalog'; // "@type" : "ids:ResourceCatalog",
		this.id = undefined;               // "@id" : "https://url-of-this-connector-api/catalogs/1",
		this.title = undefined;            // "ids:title" : ["Drone Missions"],
		this.description = undefined;      // "ids:description" : ["Purpose of catalog ", "More info on catalog"],
		this.offeredResources = [];        // "ids:offeredResource": [
	}
}

export class OfferedResourceModel extends Model {
	constructor(options) {
		super(options);
		this.type = "ids:Resource";   // "@type" : "ids:Resource",
		this.id = undefined;          // "@id" : "https://url-of-connector-api/resources/1",
		this.title = undefined;       // "ids:title" : ["Drone Missions"],
		this.description = undefined; // "ids:description" : ["Purpose of catalog ", "More info on catalog"],
		this.publisher = undefined;   // "ids:publisher": {"@id": "https://vtt.fi/"},
		this.representations = [];    // "ids:representation": [
		this.contractOffers = [];     // "ids:contractOffer": [
		
	}
}

export class RepresentationModel extends Model {
	constructor(options) {
		super(options);
		this.type = "ids:Representation"; // "@type" : "ids:Representation",
		this.id = undefined;              //"@id" : "url/representations/1",
		this.mediaType = undefined;       //  {"@type":"ids:IANAMediaType", "ids:filenameExtension": "jpg"},
		this.created = undefined;         // "ids:created": " datetimestamp",
		this.modified = undefined;        // "ids:modified": "datetimestamp",
		this.instances = [];              // "ids:instance": [
	}
}

export class InstanceModel extends Model {
	constructor(options) {
		super(options);
		this.type = "ids:Artifact";    // "@type": "ids:Artifact",
		this.id = undefined;           // "@id": "url/artifacts/1",
		this.fileName = undefined;     // "ids:fileName": "Pest.jpg",
		this.creationDate = undefined; // "ids:creationDate": "datetimestamp",
		this.byteSize = undefined;     // "ids:byteSize": 1111
	}
}

export class ContractOfferModel extends Model {
	constructor(options) {
		super(options);
		this.type = "ids:ContractOffer"; // "@type":"ids:ContractOffer",
		this.id = undefined;             // "@id": "url/contracts/1",
		this.title = undefined;          // "ids:title": "Contract A",
		this.contractStart = undefined;  // "ids:contractStart": "2022-01-01T11:33:44.995Z",
		this.contractEnd = undefined;    // "ids:contractEnd": "2023-01-01T11:33:44.995Z",
		this.contractDate = undefined;   // "ids:contractDate": "2022-04-28T12:40:04.505Z", 
		this.permissions = [];           // "ids:permission":[
	}
}

export class PermissionModel extends Model {
	constructor(options) {
		super(options);
		this.type = "ids:Permission"; // "@type": "ids:Permission",
		this.id = undefined;          // "id": "url/rules/####",
		this.title = undefined;       // "ids:title": "Permission X",
		this.description = undefined; // "ids:description" : "Permission to USE access to artifact etc.",
		this.action = undefined;      // "ids:action": ["USE"],
		this.target = undefined;      // "ids:target" : "url/artifacts/#id-of-artifact"
	}
}
