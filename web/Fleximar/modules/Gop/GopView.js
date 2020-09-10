import View from '../common/View.js';

/*
	VIEW:
	=============
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
		
	}
	areModelsReady()
	modelsErrorMessages()
	forceLogout(vid)
	showSpinner(el)
	
	GOPVIEW:
	=============
		this.rendered = false;
		this.counter = 0;
		this.FELID = 'd-view-failure';
	hide()
	remove()
	updateLatestValues()
	notify(options)  FROM MODELS: GopModel
	render()
	
*/
export default class GopView extends View {
	
	constructor(controller) {
		
		super(controller); 
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'GopModel') {
				this.models[key] = this.controller.models[key];
				console.log(['subscribe ',key,' with GopView']);
				this.models[key].subscribe(this);
			}
		});
		
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.rendered = false;
		this.counter = 0;
		//this.data = undefined;
		this.FELID = 'gop-view-failure';
		//this.timeoutIDs = [];
	}
	
	hide() {
		
		// MUST CLEAR ALL TIMERS!!!
		/*this.timeoutIDs.forEach(timeout => {
			clearTimeout(timeout);
		});
		this.timeoutIDs = [];*/
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		
		// MUST CLEAR ALL TIMERS!!!
		/*this.timeoutIDs.forEach(timeout => {
			clearTimeout(timeout);
		});
		this.timeoutIDs = [];*/
		Object.keys(this.models).forEach(key => {
			console.log(['UNsubscribe ',key,' with GopView!']);
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		this.counter = 0;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		// Not needed here!
		//$('#fetch-counter-value').empty().append(this.counter);
	}
	
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='GopModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('GopView => GopModel fetched!');
					this.counter++;
					
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestValues();
						this.chart();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("GopView ResizeEventObserver resize!!!!!!!!!!!!!!");
				// Set SVG width and height according to new window dimensions:
				// options.width options.height
				const new_width = options.width-80;
				const new_height = options.height;
				
				document.getElementById('chart-1').setAttribute("width",new_width);
				document.getElementById('chart-1').setAttribute("height",new_height);
				/*
				document.getElementById('chart-2').setAttribute("width",new_width);
				document.getElementById('chart-2').setAttribute("height",new_height);
				
				document.getElementById('chart-3').setAttribute("width",new_width);
				document.getElementById('chart-3').setAttribute("height",new_height);
				*/
				
				this.chart();
				
			}
		}
	}
	
	// Nested elements version.
	colorLegend(selection, props) {
		const {
			circleRadius,
			spacing,
			textOffset
		} = props;
		
		const groups = selection.selectAll('g')
			.data(this.controller.models['GopModel'].colorScale.domain()); // d3 data join
		
		const groupsEnter = groups
			.enter()
				.append('g')
					.attr('class','tick');
		groupsEnter
			.merge(groups) // Merge (Enter & Update)
				.attr('transform', (d,i) =>
				`translate(0,${i*spacing})`
				);
		groups.exit().remove();
		
		groupsEnter.append('circle')
			.merge(groups.select('circle'))
			// Merge (Enter & Update)
				.attr('fill',this.controller.models['GopModel'].colorScale)
				.attr('r',circleRadius);
		
		groupsEnter.append('text')
			.merge(groups.select('text'))
			// Merge (Enter & Update)
				.text(d => d)
					.attr('x', textOffset)
					.attr('dy','0.32em'); // Center vertically
	}
	
	sizeLegend(selection, props) {
		const {
			spacing,
			textOffset,
			numTicks,
			circleFill
		} = props;
		
		const ticks = this.controller.models['GopModel'].sizeScale.ticks(numTicks)
			.filter(d => d !== 0) // Filter zero out!
			.reverse(); // Big circles to top.
		
		const groups = selection.selectAll('g').data(ticks); // d3 data join
		
		const groupsEnter = groups
			.enter()
				.append('g')
					.attr('class','tick');
		groupsEnter
			.merge(groups) // Merge (Enter & Update)
				.attr('transform', (d,i) =>
				`translate(0,${i*spacing})`
				);
		groups.exit().remove();
		
		groupsEnter.append('circle')
			.merge(groups.select('circle'))
			// Merge (Enter & Update)
				.attr('fill',circleFill)
				.attr('r',this.controller.models['GopModel'].sizeScale);
		
		groupsEnter.append('text')
			.merge(groups.select('text'))
			// Merge (Enter & Update)
				.text(d => d)
					.attr('x', d => this.controller.models['GopModel'].sizeScale(d) + textOffset)
					.attr('dy','0.32em'); // Center vertically
	}
	

	chart() {
		
		// MUST CLEAR ALL TIMERS BEFORE SETTING THEM!!!
		/*this.timeoutIDs.forEach(timeout => {
			clearTimeout(timeout);
		});*/
		$('#chart-1').empty();
		const svg1 = d3.select('svg#chart-1');
		
		const g = svg1.append('g')
			.attr('transform',`translate(100,60)`);
			
		this.colorLegend(g, {
			circleRadius: 30,
			spacing: 70,
			textOffset: 50
		});
		
		const gs = svg1.append('g')
			.attr('transform',`translate(300,60)`);
			
		this.sizeLegend(gs, {
			spacing: 60,
			textOffset: 10,
			numTicks: 5,
			circleFill: 'rgba(0,0,0,0.25)'
		});
	}
	
	render() {
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			//const LM = this.controller.master.modelRepo.get('LanguageModel');
			//const sel = LM.selected;
			//const localized_string_title = LM['translation'][sel]['SOLAR_PAGE_TITLE'];
			//const localized_string_description = LM['translation'][sel]['SOLAR_PAGE_DESCRIPTION'];
			//const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 content" id="'+this.FELID+'">'+
							'<p class="error-message">'+errorMessages+'</p>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					this.forceLogout(this.FELID);
				}
				
			} else {
				const width = this.REO.width-80;
				const height = this.REO.height;
				
				const html =
					'<div class="row">'+
						'<div class="col s12 content">'+
							'<h3 style="text-align:center">Legends</h3>'+
						'</div>'+
					'</div>'+
					'<svg id="chart-1" style="border: 1px solid #000" width="'+width+'" height="'+height+'"></svg>';
				$(html).appendTo(this.el);
				
				this.chart(); // Render the complete General Update Pattern with Apples and a Lemon.
			}
			this.rendered = true;
		} else {
			console.log('GopView => render Model IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
