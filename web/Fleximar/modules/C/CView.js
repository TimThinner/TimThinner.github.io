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
	
	CVIEW:
	=============
		this.rendered = false;
		this.counter = 0;
		this.FELID = 'c-view-failure';
	hide()
	remove()
	updateLatestValues()
	notify(options)  FROM MODELS: CModel
	render()
	
*/
export default class CView extends View {
	
	constructor(controller) {
		
		super(controller); 
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'CModel') {
				this.models[key] = this.controller.models[key];
				console.log(['subscribe ',key,' with CView']);
				this.models[key].subscribe(this);
			}
		});
		
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.rendered = false;
		this.counter = 0;
		this.data = undefined;
		this.FELID = 'c-view-failure';
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			console.log(['UNsubscribe ',key,' with CView!']);
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		this.counter = 0;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		$('#fetch-counter-value').empty().append(this.counter);
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='CModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('CView => CModel fetched!');
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
				console.log("CView ResizeEventObserver resize!!!!!!!!!!!!!!");
				// Set SVG width and height according to new window dimensions:
				// options.width options.height
				const new_width = options.width-60;// + 'px'
				const new_height = options.height-40;// + 'px'
				document.getElementById('chart').setAttribute("width",new_width);
				document.getElementById('chart').setAttribute("height",new_height);
				this.chart();
			}
		}
	}
	
	chart() {
		
		$('#chart').empty();
		
		const svg = d3.select('svg');
		const data = this.data;
		console.log(data);
		
		const title = 'Temperature in Espoo';
		const W = +svg.attr('width');
		const H = +svg.attr('height');
		let tickCount = 10;
		let leftMargin = 80;
		let rightMargin = 20;
		if (W < 600) {
			tickCount = 5;
			leftMargin = 10;
			rightMargin = 0;
		}
		
		const xValue = d=>d.timestamp;
		const xAxisLabel = 'Time';
		const yValue = d=>d.temperature;
		const circleRadius = 8;
		const yAxisLabel = 'Temperature';
		const margin = {top:50, right:rightMargin, bottom:50, left:leftMargin};
		const innerWidth = W - margin.left - margin.right;
		const innerHeight = H - margin.top - margin.bottom;
		
		const xScale = d3.scaleTime()
			//.domain([0,d3.max(data,xValue)])
			.domain(d3.extent(data,xValue))
			.range([0,innerWidth]);
			//.nice(); // to make chart edges nice and sharp!
		//console.log(xScale.domain());
		
		// #8e8883
		const yScale = d3.scaleLinear()
			//.domain(data.map(yValue))
			.domain(d3.extent(data,yValue))
			.range([innerHeight,0])
			.nice();
			//.padding(0.8);
		
		const g = svg.append('g')
			.attr('transform',`translate(${margin.left},${margin.top})`);
		
		const xAxis = d3.axisBottom(xScale)
			.ticks(tickCount)
			.tickSize(-innerHeight)
			.tickPadding(10);
		
		const xAxisG = g.append('g').call(xAxis)
			.attr('transform',`translate(0,${innerHeight})`);
		xAxisG.select('.domain').remove();
		
		xAxisG.append('text')
			.attr('class','axis-label')
			.attr('fill','#fff')
			.attr('y',40)
			.attr('x',innerWidth/2)
			.text(xAxisLabel);
		
		const yAxis = d3.axisLeft(yScale)
			.tickSize(-innerWidth)
			.tickPadding(10);
		
		const yAxisG = g.append('g').call(yAxis);
		yAxisG.select('.domain').remove();
		
		yAxisG.append('text')
			.attr('class','axis-label')
			.attr('fill','#fff')
			.attr('y',-50)
			.attr('x',-innerHeight/2)
			.attr('text-anchor','middle')
			.attr('transform','rotate(-90)')
			.text(yAxisLabel);
		
		
		// If we want to create area chart replace line with area:
		const lineGenerator = d3.line()
		//const areaGenerator = d3.area()
			.x(d=>xScale(xValue(d)))
			// y0 only for area case!
			//.y0(innerHeight)
			.y(d=>yScale(yValue(d))) // y => y1 in area case!
			.curve(d3.curveBasis);
			
			
		g.append('path')
			.attr('class','line-path')
			.attr('d', lineGenerator(data)); //lineGenerator(data))
		
		/*
		g.selectAll('circle').data(data) // D3 Data Join
			.enter().append('circle')
			.attr('cy', d=>yScale(yValue(d)))
			.attr('cx',d=>xScale(xValue(d)))
			.attr('r',circleRadius);//yScale.bandwidth()/2);
		*/
		g.append('text')
			.attr('class','title')
			.attr('y',-10)
			.attr('x',innerWidth/2)
			.text(title);
			
		// Now change this to a scatter plot with circles...
		// 1. Change "rect" to a "circle"
		// 2. y      => cy
		//    width  => cx
		//    height => r
		// 3. Change yScale from scaleBand to scalePoint
		
		
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
				const initial_width = this.REO.width-60;
				const initial_height = this.REO.height-40;
				const html =
					'<svg id="chart" width="'+initial_width+'" height="'+initial_height+'"></svg>'+
					'<div class="row">'+
						'<div class="col s12 content">'+
							'<h2 style="text-align:center">VIEW C</h2>'+
							'<p id="fetch-counter-value" style="margin-top:8px;margin-bottom:8px;color:#000;text-align:center;font-size:32px;background-color:#cff;">'+this.counter+'</p>'+
							"<p>Cheese and biscuits cauliflower cheese cheesy feet. Halloumi taleggio gouda when the cheese comes out everybody's happy fromage smelly cheese fondue jarlsberg. Caerphilly macaroni cheese cheesy grin lancashire pecorino parmesan cheese triangles pecorino. Caerphilly edam taleggio jarlsberg cauliflower cheese blue castello camembert de normandie manchego. Emmental cheeseburger.</p>"+
							"<p>Boursin dolcelatte fromage. Port-salut mozzarella monterey jack melted cheese boursin bavarian bergkase port-salut camembert de normandie. Babybel port-salut mascarpone fromage blue castello pecorino cream cheese cheddar. Cheddar fromage cheesy feet.</p>"+
							"<p>Squirty cheese swiss cheeseburger. Emmental taleggio cheese on toast jarlsberg camembert de normandie fromage frais the big cheese squirty cheese. Chalk and cheese cheesecake cheddar fondue roquefort when the cheese comes out everybody's happy cheese slices cut the cheese. Cheese slices feta croque monsieur.</p>"+
							"<p>Jarlsberg fondue pepper jack. Monterey jack cheese and wine queso cream cheese fondue caerphilly rubber cheese taleggio. Smelly cheese squirty cheese fondue say cheese halloumi chalk and cheese port-salut who moved my cheese. Roquefort st. agur blue cheese monterey jack swiss when the cheese comes out everybody's happy brie melted cheese cheese on toast. Cheesecake.</p>"+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 content" id="'+this.FELID+'"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				
				d3.csv('./data/TemperatureTapiola.csv').then(data=>{
					
					data.forEach(d=>{
						d.temperature = +d["Air temperature (degC)"];
						let ds = d.Year + '-';
						d.m.length===1 ? ds += '0'+d.m+'-' : ds += d.m+'-';
						d.d.length===1 ? ds += '0'+d.d : ds += d.d;
						ds += 'T' + d.Time + ':00.00Z';
						d.ds = ds;
						d.timestamp = new Date(ds);
					});
					
					//console.log(data);
					this.data = data;
					this.chart();
				});
			}
			this.rendered = true;
		} else {
			console.log('CView => render Model IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
