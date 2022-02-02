import View from './View.js';
export default class WrapperView extends View {
	
	constructor(controller) {
		super(controller);
		this.subviews = [];
		this.selected = "b1d";
	}
	hide() {
		this.subviews.forEach(view => {
			view.hide();
		});
		$(this.el).empty();
	}
	remove() {
		this.subviews.forEach(view => {
			view.remove();
		});
		$(this.el).empty();
	}
	show() {
		console.log('NOW RENDER THE WRAPPER!');
		this.render();
	}
	
	resetButtonClass() {
		const elems = document.getElementsByClassName("my-range-button");
		for(let i = 0; i < elems.length; i++) {
			$(elems[i]).removeClass("selected");
		}
		$('#'+this.selected).addClass("selected");
	}
	
	/*
		Timerange is set with buttons.
		New param is an array of models 
	*/
	setTimerangeHandlers(models) {
		const self = this;
		
		$('#'+this.selected).addClass("selected");
		
		$('#b1d').on('click',function() {
			self.selected = "b1d";
			self.resetButtonClass();
			// Controller has all needed models + menumodel, which we ignore here.
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=1 for model.name=',model.name]);
					model.timerange = 1;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b2d').on('click',function() {
			self.selected = "b2d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=2 for model.name=',model.name]);
					model.timerange = 2;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b3d').on('click',function() {
			self.selected = "b3d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=3 for model.name=',model.name]);
					model.timerange = 3;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b4d').on('click',function() {
			self.selected = "b4d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=4 for model.name=',model.name]);
					model.timerange = 4;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b5d').on('click',function() {
			self.selected = "b5d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=5 for model.name=',model.name]);
					model.timerange = 5;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b6d').on('click',function() {
			self.selected = "b6d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=6 for model.name=',model.name]);
					model.timerange = 6;
				}
			});
			self.controller.refreshTimerange();
		});
		
		$('#b7d').on('click',function() {
			self.selected = "b7d";
			self.resetButtonClass();
			Object.keys(self.controller.models).forEach(key => {
				if (models.includes(key)) {
					const model = self.controller.models[key];
					console.log(['SET TIMERANGE=7 for model.name=',model.name]);
					model.timerange = 7;
				}
			});
			self.controller.refreshTimerange();
		});
	}
	
	render() {
		console.log('THIS SHOULD NEVER HAPPEN!!!!!!?');
	}
}
