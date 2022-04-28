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
	
	drawSpider() {
		
		$('#spider').empty();
		
		const svg = d3.select('#spider'); // <svg id="spider">
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		const width = w*0.9;				// 90% of width
		const height = this.REO.height*0.5;	// 50% of height
		
		const horiz_center = width*0.5;
		const verti_center = height*0.5;
		
		const min_dim = Math.min(horiz_center, verti_center);
		const range = min_dim - 0.15*min_dim;
		
		let data = [];
		let features = ["A", "B", "C", "D", "E", "F"];
		//generate the data
		for (var i = 0; i < 3; i++) {
			var point = {}
			//each feature will be a random number from 2-8
			features.forEach(f => point[f] = 1 + Math.random() * 8);
			data.push(point);
		}
		//let svg = d3.select("spider").append("svg").attr("width", 600).attr("height", 600);
		
		//let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);
		let radialScale = d3.scaleLinear().domain([0, 10]).range([0, range]);
		let ticks = [2, 4, 6, 8, 10];
		//draw grid lines (circles)
		ticks.forEach(t =>
			svg.append("circle")
				//.attr("cx", 300)
				//.attr("cy", 300)
				.attr("cx", min_dim)
				.attr("cy", min_dim)
				.attr("fill", "none")
				.attr("stroke", "gray")
				.attr("r", radialScale(t))
		);
		//draw tick labels
		ticks.forEach(t =>
			svg.append("text")
				//.attr("x", 305)
				//.attr("y", 300 - radialScale(t))
				.attr("x", min_dim+5)
				.attr("y", min_dim - radialScale(t))
				.text(t.toString())
		);
		//draw axis for each feature
		function angleToCoordinate(angle, value) {
			let x = Math.cos(angle) * radialScale(value);
			let y = Math.sin(angle) * radialScale(value);
			//return { "x": 300 + x, "y": 300 - y };
			return { "x": min_dim + x, "y": min_dim - y };
		}
		for (var i = 0; i < features.length; i++) {
			let ft_name = features[i];
			let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
			let line_coordinate = angleToCoordinate(angle, 10);
			let label_coordinate = angleToCoordinate(angle, 10.5);
			svg.append("line")
				.attr("x1", min_dim)//300)
				.attr("y1", min_dim)//300)
				.attr("x2", line_coordinate.x)
				.attr("y2", line_coordinate.y)
				.attr("stroke", "black");
			svg.append("text")
				.attr("x", label_coordinate.x)
				.attr("y", label_coordinate.y)
				.text(ft_name);
		}
		//drawing the line for the spider chart
		let line = d3.line().x(d => d.x).y(d => d.y);
		let colors = ["darkorange", "gray", "navy"];
		
		//get coordinates for a data point
		function getPathCoordinates(d) {
			let coordinates = [];
			for (var i = 0; i < features.length; i++) {
				let ft_name = features[i];
				let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
				coordinates.push(angleToCoordinate(angle, d[ft_name]));
			}
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
				.attr("fill", color)
				.attr("stroke-opacity", 1)
				.attr("opacity", 0.5);
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
		this.drawSpider();
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">ANALYSIS</h3>'+
						'<p>&nbsp;</p>'+
						'<p>&nbsp;</p>'+
						'<p>ANALYSIS UNDER CONSTRUCTION!</p>'+
						'<p>&nbsp;</p>'+
						'<p>&nbsp;</p>'+
					'</div>'+
					'<div class="col s12 center">'+
						'<div id="spider-wrapper"></div>'+
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
		this.rendered = true;
	}
}
