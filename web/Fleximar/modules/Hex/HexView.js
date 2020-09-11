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
	
	HEXVIEW:
	=============
		this.rendered = false;
		this.counter = 0;
		this.FELID = 'view-failure';
	hide()
	remove()
	updateLatestValues()
	notify(options)  FROM MODELS: DModel
	render()
	
*/
export default class HexView extends View {
	
	constructor(controller) {
		
		super(controller); 
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'HexModel') {
				this.models[key] = this.controller.models[key];
				console.log(['subscribe ',key,' with HexView']);
				this.models[key].subscribe(this);
			}
		});
		
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.rendered = false;
		
		this.FELID = 'view-failure';
	}
	
	hide() {
		
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		
		Object.keys(this.models).forEach(key => {
			console.log(['UNsubscribe ',key,' with HexView!']);
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		
		$(this.el).empty();
	}
	
	updateLatestValues() {
		// Not needed here!
		//$('#fetch-counter-value').empty().append(this.counter);
	}
	
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='HexModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('HexView => HexModel fetched!');
					this.counter++;
					
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestValues();
						
						
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
				
				const new_width = options.width-80;
				const new_height = options.height;
				document.getElementById('chart-1').setAttribute("width",new_width);
				document.getElementById('chart-1').setAttribute("height",new_height);
				
				this.chart();
			}
		}
	}
	
	/*
	In each SVG w = window width-60 and h = window height/4.
	We can scale the apples (and bowl) according to actual window dimensions.
	We want to accommodate 7 apples => 
	 
	
	The width for each apple (using margins on both side) = W/(7+2)
	The height of each apple = 
	
	
	
	https://unpkg.com/world-atlas@1.1.4/world/110m.tsv
	https://unpkg.com/world-atlas@1.1.4/world/110m.json
	
	*/
	
	
	// Nested elements version.
	colorLegend(selection, props) {
		const {
			colorScale,
			circleRadius,
			spacing,
			textOffset,
			backgroundRectWidth
		} = props;
		/*
		const colorScale = d3.scaleOrdinal()
			.domain(['apple','lemon','lime','orange'])
			.range(['red','yellow','green','orange']);
		*/
		
		const backgroundRect = selection.selectAll('rect')
			.data([null]);
		backgroundRect.enter().append('rect')
			.merge(backgroundRect)
				.attr('x',-circleRadius*2)
				.attr('y',-circleRadius*2)
				.attr('rx',circleRadius*2)
				.attr('width',backgroundRectWidth)
				.attr('height',spacing*colorScale.domain().length+circleRadius*2)
				.attr('fill','#fff')
				.attr('opacity',0.5);
				
		const groups = selection.selectAll('g')
			.data(colorScale.domain()); // d3 data join
		
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
				.attr('fill',colorScale)
				.attr('r',circleRadius);
		
		groupsEnter.append('text')
			.merge(groups.select('text'))
			// Merge (Enter & Update)
				.text(d => d)
					.attr('x', textOffset)
					.attr('dy','0.32em'); // Center vertically
	}
	
	chart() {
		
		const width = this.REO.width-80;
		const height = this.REO.height;
		
		$('#chart-1').empty();
		const svg = d3.select('svg#chart-1');
		//const projection = d3.geoMercator();
		//const projection = d3.geoOrthographic();
		//const projection = d3.geoStereographic();
		const projection = d3.geoNaturalEarth1();
		
		const pathGenerator = d3.geoPath().projection(projection);
		
		
		const g = svg.append('g');
		
		g.append('path')
			.attr('class','sphere')
			.attr('d', pathGenerator({type: 'Sphere'}));
		
		svg.call(d3.zoom().on('zoom',event=>{
			//console.log('Zoom!');
			g.attr('transform',event.transform);
		}));
		// 110m => 50m
		//
		
		
		
		Promise.all([
			d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
			d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
		]).then(([tsvData, topoJSONData])=>{
			//console.log(tsvData);
			//console.log(topoJSONData);
			const rowById = {};
			tsvData.forEach(d=> {
				// Use d.name for the title
				// Use d.iso_n3 for id
				rowById[d.iso_n3] = d;
			});
			const countries = topojson.feature(topoJSONData, topoJSONData.objects.countries);
			countries.features.forEach(d => {
				Object.assign(d.properties, rowById[d.id]);
			});
			//console.log(countries);
			
			
			//const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
			// See the colors from: d3-scale-chromatic
			const colorScale = d3.scaleOrdinal();
			//const colorValue = d => d.properties.economy;
			// TRY ANOTHER PARAM:
			const colorValue = d => d.properties.income_grp;
			
			colorScale
				.domain(countries.features.map(colorValue))
				.domain(colorScale.domain().sort().reverse())
				.range(d3.schemeSpectral[colorScale.domain().length]);
			
			g.selectAll('path').data(countries.features)
				.enter().append('path')
					.attr('class','choropleth-country')
					.attr('d', pathGenerator)
					.attr('fill',d=>colorScale(colorValue(d)))
				.append('title')
					.text(d=>d.properties.name+': '+colorValue(d));
			
			const colorLegendG = g.append('g').attr('transform',`translate(20,280)`);
			this.colorLegend(colorLegendG, {
				colorScale,
				circleRadius: 10,
				spacing: 24,
				textOffset: 20,
				backgroundRectWidth: 250
			});
		});
		
		/*
		d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv')
			.then(data=>{
				//console.log(data);
			});*/
		
		
		//d3.json('./data/countries-110m.json')
		/*d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
			.then(data => {
				//console.log(data);
				const countries = topojson.feature(data, data.objects.countries);
				//console.log(countries);
				svg.selectAll('path').data(countries.features)
					.enter().append('path')
						.attr('class','country')
						.attr('d', pathGenerator)
					.append('title')
						.text('Huu');
			});*/
		
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
							'<h3 style="text-align:center">A Choropleth Map</h3>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 content" id="'+this.FELID+'"></div>'+
					'</div>'+
					'<div class="row">'+
					'<div class="col s12 center">'+
						'<svg id="chart-1" width="'+width+'" height="'+height+'"></svg>'+
					'</div>';
				$(html).appendTo(this.el);
				
				this.chart();
				
			}
			this.rendered = true;
		} else {
			console.log('HexView => render Model IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
