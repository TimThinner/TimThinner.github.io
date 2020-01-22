/*

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);

*/
export default class DistrictAView {
	
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.model = controller.master.modelRepo.get('DistrictAModel');
		this.model.subscribe(this);
		this.svgObject = undefined;
		this.rendered = false;
		this.visible = false;
	}
	
	show() {
		this.visible = true;
		this.render();
	}
	
	hide() {
		this.visible = false;
		this.svgObject = undefined;
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.visible = false;
		this.model.unsubscribe(this);
		this.svgObject = undefined;
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		console.log("UPDATE!");
	}
	
	notify(options) {
		if (this.visible) {
			if (options.model==='DistrictAModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('DistrictAView => DistrictAModel fetched!');
					if (this.rendered) {
						$('#district-a-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#district-a-view-failure').empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#district-a-view-failure');
					} else {
						this.render();
					}
				}
			}
		}
	}
	
	addSVGEventHandlers() {
		const self = this;
		this.svgObject = document.getElementById('svg-object').contentDocument;
		if (typeof this.svgObject !== 'undefined') {
			console.log("svgObject is now ready!");
			$("#toggle-direction").on('click',function(){
				let pathElement = self.svgObject.getElementById('p1');
				//<text id="grid-power" x="400" y="380" font-family="Arial, Helvetica, sans-serif" font-size="42px" fill="#f00">120.0 kW</text>
				let textElement = self.svgObject.getElementById('grid-power');
				
				let d = pathElement.getAttributeNS(null, 'd');
				//console.log(['d=',d]);
				const head = d.slice(0,20);
				const tail = d.slice(20);
				if (head === 'M 300,400 L 1000,400') {
					// Change text GREEN and value 2.5 kW
					while (textElement.firstChild) {
						textElement.removeChild(textElement.firstChild);
					}
					var txt = document.createTextNode("2.5 kW");
					textElement.appendChild(txt);
					textElement.setAttributeNS(null, 'fill', '#0a0');
					
					const new_d = "M 1000,400 L 300,400" + tail;
					pathElement.setAttributeNS(null, 'd', new_d);
					
				} else {
					// Change text RED and value 120.0 kW
					while (textElement.firstChild) {
						textElement.removeChild(textElement.firstChild);
					}
					var txt = document.createTextNode("120.0 kW");
					textElement.appendChild(txt);
					textElement.setAttributeNS(null, 'fill', '#f00');
					
					const new_d = "M 300,400 L 1000,400" + tail;
					pathElement.setAttributeNS(null, 'd', new_d);
				}
			});
		}
	}
	
	showSpinner(el) {
		const html =
			'<div id="preload-spinner" style="text-align:center;"><p>&nbsp;</p>'+
				'<div class="preloader-wrapper active">'+
					'<div class="spinner-layer spinner-blue-only">'+
						'<div class="circle-clipper left">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="gap-patch">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="circle-clipper right">'+
							'<div class="circle"></div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<p>&nbsp;</p>'+
			'</div>';
		$(html).appendTo(el);
	}
	
	render() {
		const self = this;
		
		
		console.log('DistrictAView => render%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
		
		$(this.el).empty();
		if (this.model.ready) {
			
			if (this.model.errorMessage.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="district-a-view-failure">'+
							'<div class="error-message"><p>'+this.model.errorMessage+'</p></div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<p>UUPS! Something went wrong.</p>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s6 center">'+
							'<a href="javascript:void(0);" id="back" class="waves-effect waves-light btn-large"><i class="material-icons left">arrow_back</i>BACK</a>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
			} else {
				const html =
					'<div class="row">'+
						'<div class="col s12">'+
							'<div class="svg-landscape-container">'+
								'<object type="image/svg+xml" data="DA.svg" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="district-a-view-failure"></div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<p>This view <b>will</b> contain all charts and graphs for District A. Click the button "Toggle direction" to change energy flow back to GRID.</p>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s6 center">'+
							'<a href="javascript:void(0);" id="back" class="waves-effect waves-light btn-large"><i class="material-icons left">arrow_back</i>BACK</a>'+
						'</div>'+
						'<div class="col s6 center">'+
							'<a id="toggle-direction" class="waves-effect waves-light btn-large">Toggle direction</a>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					console.log('ADD SVG EVENT HANDLERS!');
					self.addSVGEventHandlers();
				});
			}
			$('#back').on('click',function() {
				self.controller.menuModel.setSelected('menu');
			});
			this.rendered = true;
			
		} else {
			console.log('DistrictAView => render MenuModel IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}
