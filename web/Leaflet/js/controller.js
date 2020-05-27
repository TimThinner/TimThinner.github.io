/*
*/
class AppController {
	constructor() {
		this.mapListModel = undefined;
		this.mapView = undefined;
	}
	run() {
		this.mapListModel = new MapListModel();
		this.mapView = new MapView(this, this.mapListModel, '#map');
		this.mapView.renderMap();
	}
}
new AppController().run();
