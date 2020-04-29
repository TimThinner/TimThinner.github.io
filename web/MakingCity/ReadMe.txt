

MasterController keeps track of ALL controllers and Models in the SYSTEM.
It has two instance properties to do that:
	this.controllers = {};
	this.modelRepo = new ModelRepo();
The ModelRepo is just a collection of (key, value) pairs, such that each possible key appears at most once in the collection.


First the MasterController creates all controllers and adds them to its controllers hash, for example:
	this.controllers['DAB'] = new DistrictABController({name:'DAB', master:this, el:'#content', visible:false});
	this.controllers['DAB'].init();

The init()-method creates all models and a view for this Controller.

For example here is how a SolarModel is added to modelRepo in "SolarController":
	const model = new SolarModel({name:'SolarModel',src:'data/arina/iss/feeds.json?meterId=116'});
	model.subscribe(this);
	this.master.modelRepo.add('SolarModel',model);
	this.models['SolarModel'] = model;

And a timer is defined for periodic fetching of data for "SolarModel":
	this.timers['SolarChartView'] = {timer: undefined, interval: 30000, models:['SolarModel']};
It is important to notice here that one chart can display data from multiple models, but one chart can have only one timer.

We also have to listen MenuModel for View changes from USER:
	this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
	this.models['MenuModel'].subscribe(this);

If there are many charts in one view, a Controller creates a WrapperView, which holds all subviews.
So finally a WrapperView is created and shown (if this controller is visible):
	this.view = new DistrictABWrapperView(this);
	this.show();

Actually Controller's show() -method shows view and starts the poller:
	this.view.show();
	this.startPollers();
Which starts polling all timers for this controller. 
This is important, because all views must always show "the latest" data fetched from the server.
When a view is shown (=rendered), it first creates a skeleton of HTML markup, where empty data-placeholders are inserted into parent element. 
If all models are ready (areModelsReady()) then also the data is available and it is appended into placeholders. 
But if all models are NOT ready we show a Wait-spinner and wait for Model to trigger "fetched" notification. The models (one or many) also notify View whenever new data is fetched. So the chart update can happen "out-of-sync", one model at a time. 



Q: How does a view "know" when it has to refresh its display?
A: When a view is created, it starts to listen for its model(s), like this:
	// Which models I have to listen? Select which ones to use here:
	Object.keys(this.controller.models).forEach(key => {
		if (key === 'SolarModel') {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		}
	});

Q: How is the View-switch implemented?
A: Each view-switch actually involves hiding all other controllers (with views) and AFTER THAT showing the selected one.
So it starts when MenuModel sends a "selected" -notification, see code below:
	/*
		Every Controller must subscribe for "MenuModel" notifications.
		After that all view changes are driven by this code. Note that by using 
		timeout we make all other "VIEWS" hidden before showing the selected one.
	*/
	notify(options) {
		if (options.model==='MenuModel' && options.method==='selected') {
			if (this.name === options.selected) {
				setTimeout(() => {
					this.visible = true;
					this.restore();
					this.show();
				}, 100);
			} else {
				this.visible = false;
				this.hide();
			}
		}
	}
Note that when we hide a controller (view), it is important to clear all timers, because we don't want to fetch data for models which are not shown:

	Object.keys(this.timers).forEach(key => {
		if (this.timers[key].timer) {
			clearTimeout(this.timers[key].timer);
			this.timers[key].timer = undefined;
		}
	});
	if (this.view) {
		this.view.hide();
	}

The ES6 Classes and Object-Oriented Programming (OOP) is a great way to organize your projects. Introduced with ES6, the javascript class syntax makes OOP easier. Before the class syntax was available, if you wanted to do OOP you would need to use a constructor function.
https://www.javascriptjanuary.com/blog/es6-classes


EventObserver
	ResizeEventObserver
	AlertEventObserver

View
	SVGView

TimerEventObserver
	Controller


Can we insert dynamically new SVG into existing UI?
For example when user is logged in, we should be able to add functionality into menuXXX ...


						width	height		viewBox
menuLandscape.svg		"1800"	"900"		"-900 -500 1800 900"
menuSquare.svg			"1000"	"900"		"-500 -500 1000 900"
menuPortrait.svg		"600"	"900"		"-300 -500 600 900"

DLandscape.svg			"1800"	"900"		"0 0 1800 900"
DSquare.svg				"1000"	"900"		"0 0 1000 900"
DPortrait.svg			"600"	"900"		"0 0 600 900"

DALandscape.svg			"1800"	"900"		"0 0 1800 900"
DASquare.svg			"1000"	"900"		"0 0 1000 900"
DAPortrait.svg			"600"	"900"		"0 0 600 900"

svg width="1000" height="900" 900 = x/100 * 1000 => x = 90000/1000 = 90
svg width="1800" height="900" 900 = x/100 * 1800 => x = 90000/1800 = 50
svg width="600" height="900"  900 = x/100 * 600 => x = 90000/600 = 150






