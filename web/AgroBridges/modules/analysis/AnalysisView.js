import View from '../common/View.js';

/*
	D3 Spider Chart Tutorial
	https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
	
	Spider charts, also known as radar charts, are a type of chart that can display multiple features of each data point.
	They are similar to bar charts, except each axis extends out radially from the center of the chart.
	They can sometimes be an alternative to line charts, and are useful for overlaying and comparing data that have multiple variables.
	
*/

export default class AnalysisView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.rendered = false;
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				//console.log('ResizeEventObserver resize => SHOW()!');
				this.show();
			}
		}
	}
	
	renderBusinessModelsText() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_intro = LM['translation'][sel]['Intro_Definition_Business_Models'];
		const ll_def_csa = LM['translation'][sel]['Definition_CSA'];
		const ll_def_f2f = LM['translation'][sel]['Definition_Face_2_Face'];
		const ll_def_online_trade = LM['translation'][sel]['Definition_Online_Trade'];
		const ll_def_retail_trade = LM['translation'][sel]['Definition_Retail_Trade'];
		const ll_def_improved_logistics = LM['translation'][sel]['Definition_Improved_Logistics'];
		const ll_def_more_info = LM['translation'][sel]['More_Info_Business_Models'];
		
		// Note: put little bit of vertical space below each li-item!
		// See styles.css:
		// li.agro-item:not(:last-child) { 
		//		margin-bottom: 12px;
		// }
		const html = '<p>'+ll_intro+'</p>'+
			'<ul class="browser-default"><li class="agro-item">'+ll_def_csa+'</li>'+
			'<li class="agro-item">'+ll_def_f2f+'</li>'+
			'<li class="agro-item">'+ll_def_online_trade+'</li>'+
			'<li class="agro-item">'+ll_def_retail_trade+'</li>'+
			'<li class="agro-item">'+ll_def_improved_logistics+'</li></ul>'+
			'<p>'+ll_def_more_info+'</p>';
		$("#business-models-text-wrapper").empty().append(html);
	}
	
	renderRecommendationsText() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_intro = LM['translation'][sel]['Result1_Models_Considered'];
		
		const ll_r1_more_than_2_suitable = LM['translation'][sel]['Result_Farms_more_than_2_suitable'];
		const ll_r2_more_than_2_suitable = LM['translation'][sel]['Results2_Farm_more_2_suitable'];
		const ll_r1_no_suitable = LM['translation'][sel]['Results1_farms_no_suitable_channels'];
		const ll_r2_no_suitable = LM['translation'][sel]['Results2_farm_no_suitable_Channels'];
		const ll_r1_only_1_suitable = LM['translation'][sel]['Results1_only_one_channel'];
		const ll_r2_only_1_suitable = LM['translation'][sel]['Results2_only_one_channel'];
		
		let html = '<p>'+ll_intro+'</p>';
		const numberOfResults = 3;
		if (numberOfResults === 0) {
			html += '<p>'+ll_r1_no_suitable+'</p>';
			
		} else if(numberOfResults === 1) {
			html += '<p>'+ll_r1_only_1_suitable+'</p>';
			
		} else { // Two or more...
			html += '<p>'+ll_r1_more_than_2_suitable+'</p>';
		}
		// SHOW EXAMPLE TABLE:
		// RANK	SALES_CHANNEL			BUSINESS_MODEL
		// 1	On_Farm_Shop_extensive	Face-to-Face
		// 2	Online_Sales_Post		Online Trade
		// 3	Retail_Store			Retail Trade
		html += 
			'<table>'+
				'<thead>'+
					'<tr>'+
						'<th>Rank</th>'+
						'<th>Sales Channel</th>'+
						'<th>Business Model</th>'+
					'</tr>'+
				'</thead>'+
				'<tbody>'+
					'<tr>'+
						'<td>1</td>'+
						'<td>On_Farm_Shop_extensive</td>'+
						'<td>Face-to-Face</td>'+
					'</tr>'+
					'<tr>'+
						'<td>2</td>'+
						'<td>Online_Sales_Post</td>'+
						'<td>Online Trade</td>'+
					'</tr>'+
					'<tr>'+
						'<td>3</td>'+
						'<td>Retail_Store</td>'+
						'<td>Retail Trade</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>';
		
		if (numberOfResults === 0) {
			html += '<p>'+ll_r2_no_suitable+'</p>';
			
		} else if(numberOfResults === 1) {
			html += '<p>'+ll_r2_only_1_suitable+'</p>';
			
		} else { // Two or more...
			html += '<p>'+ll_r2_more_than_2_suitable+'</p>';
		}
		$("#recommendations-text-wrapper").empty().append(html);
	}
	
	/* Note:
		light-blue background:	#e5ecf6
		blue line:				#5965fa
	*/
	drawSpider(name, spider_id) {
		
		$('#'+spider_id).empty();
		
		const svg = d3.select('#'+spider_id);
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		const width = w*0.9;				// 90% of width
		const height = this.REO.height*0.5;	// 50% of height
		
		const horiz_center = width*0.5;
		const verti_center = height*0.5;
		
		const min_dim = Math.min(horiz_center, verti_center);
		
		// Make spider a litle bit smaller:
		//const range = min_dim - 0.15*min_dim;
		const range = min_dim - 0.25*min_dim;
		console.log(['range=',range]);
		
		let fontsize;
		if (range <= 120) {
			fontsize = 8;
		} else if (range > 120 && range <= 160) {
			fontsize = 10;
		} else if (range > 160 && range <= 200) {
			fontsize = 12;
		} else {
			fontsize = 14;
		}
		
		let data = [];
		let features = [
			"Volume", 
			"Consumer Contact", 
			"Gender Equality", 
			"Lower Labor Produce Ratio", 
			"Lower Carbon Footprint", 
			"Chain Added Value",
			"Price Premium"]; // 7!
		//generate the data (only one set)
		
		//wholesale diagram results:
		//diagram_title_id;Volume;Price_Premium;Chain_Added_Value;Carbon_Footprint;Labor_Produce;Gender_Equality;Consumer_Contact
		//Wholesale;1;0,243019648;0,093587522;0,27142858;1;0,498997996;0,2
		
		// Volume;				1
		// Price_Premium;		0.243019648;
		// Chain_Added_Value;	0.093587522;
		// Carbon_Footprint;	0.27142858;
		// Labor_Produce;		1
		// Gender_Equality;		0.498997996
		// Consumer_Contact		0.2
		if (name === 'wholesale') {
			data = [{
				"Volume":1,
				"Consumer Contact":0.2,
				"Gender Equality":0.498997996,
				"Lower Labor Produce Ratio":1,
				"Lower Carbon Footprint":0.27142858,
				"Chain Added Value":0.093587522,
				"Price Premium":0.243019648
			}];
			//data.push({"Volume":1});
			//data.push({"Consumer Contact":0.2});
			//data.push({"Gender Equality":0.498997996}); 
			//data.push({"Lower Labor Produce Ratio":1});
			//data.push({"Lower Carbon Footprint":0.27142858});
			//data.push({"Chain Added Value":0.093587522});
			//data.push({"Price Premium":0.243019648});
			
		} else {
			for (let i = 0; i < 1; i++) {
				let point = {}
				//each feature will be a random number from 2-8
				//features.forEach(f => point[f] = 1 + Math.random() * 8);
				//each feature will be a random number from 0 to 1
				features.forEach(f => point[f] = Math.random());
				data.push(point);
			}
		}
		
		//let svg = d3.select("spider").append("svg").attr("width", 600).attr("height", 600);
		
		//let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);
		let radialScale = d3.scaleLinear().domain([0, 1]).range([0, range]);
		//let ticks = [0.2, 0.4, 0.6, 0.8, 1];
		let ticks = [1, 0.8, 0.6, 0.4, 0.2];
		//draw grid lines (circles)
		ticks.forEach(t =>
			svg.append("circle")
				//.attr("cx", 300)
				//.attr("cy", 300)
				.attr("cx", horiz_center) // min_dim)
				.attr("cy", verti_center) // min_dim)
				.attr("fill", "#e5ecf6") // "none"
				.attr("stroke", "#fff")//"gray")
				.attr("r", radialScale(t))
		);
		// draw tick labels
		// fontsize = 8,10,12,14
		ticks.forEach(t =>
			svg.append("text")
				//.attr("x", 305)
				//.attr("y", 300 - radialScale(t))
				.attr("x", horiz_center+5)
				.attr("y", verti_center - radialScale(t))
				.attr("font-size",fontsize+2)
				.text(t.toString())
		);
		//draw axis for each feature
		function angleToCoordinate(angle, value) {
			let x = Math.cos(angle) * radialScale(value);
			let y = Math.sin(angle) * radialScale(value);
			//return { "x": 300 + x, "y": 300 - y };
			return { "x": horiz_center + x, "y": verti_center - y };
		}
		for (var i = 0; i < features.length; i++) {
			let ft_name = features[i];
			let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
			let line_coordinate = angleToCoordinate(angle, 1);//10);
			let label_coordinate = angleToCoordinate(angle, 1.1); // 10.5);
			
			// fontsize = 8,10,12,14
			if (ft_name === 'Volume') {
				label_coordinate.x -= fontsize*3; // 6 characters
			} else if (ft_name === 'Consumer Contact') { // 16 characters
				label_coordinate.x -= fontsize*7;
			} else if (ft_name === 'Gender Equality') { // 15 characters
				label_coordinate.x -= fontsize*5;
			} else if (ft_name === 'Lower Labor Produce Ratio') { // 25 characters
				label_coordinate.x -= fontsize*8;
			} else if (ft_name === 'Lower Carbon Footprint') { // 22 characters
				label_coordinate.x -= fontsize*4;
			} else if (ft_name === 'Chain Added Value') { // 17 characters
				label_coordinate.x -= fontsize*4;
			} else if (ft_name === 'Price Premium') { // 13 characters
				label_coordinate.x -= fontsize*3;
			}
			svg.append("line")
				.attr("x1", horiz_center)//min_dim 300)
				.attr("y1", verti_center)//min_dim 300)
				.attr("x2", line_coordinate.x)
				.attr("y2", line_coordinate.y)
				.attr("stroke", "#fff");//"black");
			svg.append("text")
				.attr("x", label_coordinate.x)
				.attr("y", label_coordinate.y)
				.attr("font-size",fontsize)
				.text(ft_name);
		}
		//drawing the line for the spider chart
		let line = d3.line().x(d => d.x).y(d => d.y);
		//let colors = ["darkorange", "gray", "navy"];
		let colors = ["#5965fa","darkorange","gray"];
		//get coordinates for a data point
		function getPathCoordinates(d) {
			let coordinates = [];
			for (var i = 0; i < features.length; i++) {
				let ft_name = features[i];
				let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
				coordinates.push(angleToCoordinate(angle, d[ft_name]));
			}
			// Add also the last connecting coordinate from last point to the first point.
			coordinates.push(angleToCoordinate(Math.PI/2, d[features[0]]));
			return coordinates;
		}
		
		for (var i = 0; i < data.length; i++) {
			let d = data[i];
			let color = colors[i];
			let coordinates = getPathCoordinates(d);
			
			//draw the path element
			svg.append("path")
				.datum(coordinates)
				.attr("d", line)
				.attr("stroke-width", 3)
				.attr("stroke", color)
				.attr("fill", "none")//color)
				.attr("stroke-opacity", 1)
				.attr("opacity", 1) //0.5);
		}
	}
	
	renderSpider() {
		$('#spider-wrapper').empty();
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		const width = w*0.9;				// 90% of width
		const height = this.REO.height*0.5;	// 50% of height
		
		const html = '<svg id="spider" width="'+width+'" height="'+height+'"></svg>';
		$(html).appendTo('#spider-wrapper');
		this.drawSpider('wholesale','spider');
	}
	
	renderResultsSpiders() {
		
		$('#results-spiders-wrapper').empty();
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		
		const width = w*0.9;				// 90% of width
		const height = this.REO.height*0.4;	// 40% of height
		
		let xwidth = width;		// small screen has only one spider per row.
		if (w > 600) {			// medium or bigger screen...
			xwidth = width/3;	// has 3 equal wide cols to hold spiders.
		}
		const html = 
			'<div class="col s12 m4 center">'+
				'<svg id="spider-r1" width="'+xwidth+'" height="'+height+'"></svg>'+
			'</div>'+
			'<div class="col s12 m4 center">'+
				'<svg id="spider-r2" width="'+xwidth+'" height="'+height+'"></svg>'+
			'</div>'+
			'<div class="col s12 m4 center">'+
				'<svg id="spider-r3" width="'+xwidth+'" height="'+height+'"></svg>'+
			'</div>';
		$(html).appendTo('#results-spiders-wrapper');
		
		this.drawSpider('diagram1',' spider-r1');
		this.drawSpider('diagram2', 'spider-r2');
		this.drawSpider('diagram3', 'spider-r3');
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		/*
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_intro = LM['translation'][sel]['Intro_Definition_Business_Models'];
		*/
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">ANALYSIS</h3>'+
					'</div>'+
					'<div class="col s12 center">'+
						'<h6>Sales over the Wholesale market</h6>'+
						'<div id="spider-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6 style="text-align:center">Business models for Short Food Supply Chain</h6>'+
						'<div id="business-models-text-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6 style="text-align:center">Recommendations for Short Food Supply Chain</h6>'+
						'<div id="recommendations-text-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="results-spiders-wrapper"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="analysis-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		$("#analysis-ok").on('click', function() {
			self.controller.models['MenuModel'].setSelected('main');
		});
		this.renderSpider();
		this.renderBusinessModelsText();
		this.renderRecommendationsText();
		this.renderResultsSpiders();
		this.rendered = true;
	}
}
