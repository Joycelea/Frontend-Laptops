import React from 'react'
import CanvasJSReact from '../canvasJS/canvasjs.react';
import { getColor} from '../libary/getColor.js' ;
import { getVariableSize} from '../libary/getVariableSize.js' ;

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var useTooltip = false;
var onHover = true;
var useZoom = true;

var xAxis = "Pos";
var yAxis = "Un";
var sizeAxis = "Neg";

var fadeInGraph = true;

class ScatterChart extends React.Component {
	
	constructor(props){
		super(props);
	
	  const dataPointsTest = props.topDocuments.map((element, index) => {
		var pos;
		var neg;
		var un;
		var incon;
		JSON.parse(element.score).map((element2, index2) => {
			if(element2['type'] === 'Positive') pos = element2['value'];
			if(element2['type'] === 'Negative') neg = element2['value'];
			if(element2['type'] === 'Uncertain') un = element2['value'];
			if(element2['type'] === 'Inconsistent') incon = element2['value'];
			}
		);
		
		var useAxisX;
		var useAxisY;
		
		if(xAxis === "Pos") useAxisX = pos;
		if(xAxis === "Neg") useAxisX = neg;
		if(xAxis === "Un") useAxisX = un;
		if(xAxis === "In") useAxisX = incon;
		
		if(yAxis === "Pos") useAxisY = pos;
		if(yAxis === "Neg") useAxisY = neg;
		if(yAxis === "Un") useAxisY = un;
		if(yAxis === "In") useAxisY = incon;
		
		var markerSizePoint = 15
		var variableMarkerSize = null
		
		if(sizeAxis === "Pos") variableMarkerSize = pos
		if(sizeAxis === "Neg") variableMarkerSize = neg
		if(sizeAxis === "Un") variableMarkerSize = un
		if(sizeAxis === "In") variableMarkerSize = incon
		
		if(variableMarkerSize !== null)
			markerSizePoint = getVariableSize({variableMarkerSize});
		
		var colorCalc = getColor({un, incon}).toString().toUpperCase();
		
		return ( { x: useAxisX, y: useAxisY, pos:pos, neg:neg, un: un, incon: incon, color: "008000", markerSize: markerSizePoint, name: element['name'], h_id: element['h_id'], query:this.props.topDocuments.query, mouseover: this.props.updateInfobox, mouseout: this.props.emptyInfobox });
	    })
		
		const posAxis = {
			title:"Positive",
			suffix: "%"
			};
		const negAxis = {
			title:"Negative",
			suffix: "%",
			reversed: true
			};
		const unAxis = {
			title:"Undetermined",
			suffix: "%"
			};
		const inAxis = {
			title:"Inconsistent",
			suffix: "%"
			};
		
		var xAxisLable = posAxis;
		var yAxisLable = negAxis;
		
		if(xAxis === "Pos") xAxisLable = posAxis;
		if(xAxis === "Neg") xAxisLable = negAxis;
		if(xAxis === "Un") xAxisLable = unAxis;
		if(xAxis === "In") xAxisLable = inAxis;
		
		if(yAxis === "Pos") yAxisLable = posAxis;
		if(yAxis === "Neg") yAxisLable = negAxis;
		if(yAxis === "Un") yAxisLable = unAxis;
		if(yAxis === "In") yAxisLable = inAxis;
		
		const toolTip = "<b>{name}</b><br/><b>Positive: </b>{pos}<br/><b>Negative: </b>{neg}<br/>"+
		                        "<b>Uncertain: </b>{un}<br/><b>Inconsistent: </b>{incon}";
		const chartTitle = "Search result for {query}";
		
		this.options = {
			theme: "dark2",
			animationEnabled: fadeInGraph,
			animationDuration: 50,
			zoomEnabled: useZoom,
			zoomType: "x",
			title:{
				text: ""
			},
			axisX: xAxisLable,
			axisY: yAxisLable,
			tooltip: useTooltip,
			data: [{
				type: "scatter",
				toolTipContent: toolTip,
				highlightEnabled: false,
				click: this.props.dataPointClicked,
				dataPoints: dataPointsTest
			}]
		}
	}
	
	render() {
		return (
		<div id="scatterChart">
		    <CanvasJSChart options = {this.options}
		    />
        </div>
		);
	}
}

export default ScatterChart