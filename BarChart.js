import React, {Component} from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
    callables = null;

    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
    }

    componentDidMount() {
        // console.log(this.props)
        // this.props.setCallables({
        //     triggerUpdate: this.triggerUpdate
        // });
        this.createBarChart()

    }

    componentDidUpdate() {
        // if (prev.data != this.props.data) {
        //     console.log("update create")
        this.createBarChart()
        // }

    }

    triggerUpdate = () => {
        // this.createBarChart()
    }

    createBarChart() {
        // console.log(this.props.data); return
        let self = this
        if (this.props.data != null) {
            let data = this.props.data.item.score
            this.data = []
            this.props.axises.forEach(function (axis) {
                self.data.push({"name": axis.label, "value": data[axis.value]})
            })
            // this.data = Object.keys(data)
            //     .map(function (key) {
            //         return {"name": key, "value": data[key]};
            //     });

            var fullw = 220;
            var fullh = 80;

            var margin = {
                top: 0,
                right: 10,
                bottom: 20,
                left: 70
            }

            var widthScale = d3.scaleLinear()
                .domain([0, 1])
                .range([0, fullw]);

            var heightScale = d3.scaleBand()
                .rangeRound([0, fullh])
                .paddingInner(0.2)
                .domain(this.data.map(function (d) {
                    return d.name;
                }));

            d3.select(this.node).selectAll("*").remove();
            // console.log(d3.select(this.node))
            var svg = d3.select(this.node)
                .attr("width", fullw + margin.left + margin.right)
                .attr("height", fullh + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

            var barcolor = function (key) {
                if (key === "Negative") return "red";
                else if (key === "Positive") return "green";
                else if (key === "Inconsistent") return "blue";
                else return "gray";
            }


            var bars = svg.selectAll("rect")
                .data(this.data)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", function (d) {
                    return heightScale(d.name);
                })
                .attr("width", function (d) {
                    return widthScale(d.value);
                })
                .attr("height", heightScale.bandwidth())
                .style("fill", function (d, i) {
                    return barcolor(d.name);
                });

            // bars.append("text")
            //     .attr("class", "label")
            //     //y position of the label is halfway down the bar
            //     .attr("y", function (d) {
            //         return heightScale(d.name) + heightScale.bandwidth() / 2 + 4;
            //     })
            //     //x position is 3 pixels to the right of the bar
            //     .attr("x", 0)
            //     .text(function (d) {
            //         return d.value;
            //     })
            //     .style("fill", "black");


            var yAxis = d3.axisLeft(heightScale).tickSize(0);

            var gY = svg.append("g")
                .attr("transform", `translate(${0},0)`)
                .call(yAxis);

            let xAxis = d3.axisBottom(widthScale).ticks(5)
            var gX = svg.append("g")
                .attr("transform", `translate(0,${fullh})`)
                .call(xAxis);

            // gridlines in y axis function
            function make_x_gridlines() {
                return d3.axisBottom(widthScale)
                    .ticks(5)
            }

            // add the X gridlines
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", `translate(0,${fullh})`)
                .attr("stroke", "currentColor")
                .attr("stroke-opacity", 0.2)
                .style("stroke-dasharray", "5,5")
                .call(make_x_gridlines()
                    .tickSize(-fullh)
                    .tickFormat("")
                )


        }
    }

    render() {
        if (this.props.data != null) {
            return <svg ref={node => this.node = node}></svg>
        } else return ""

        // return <div className="barchart-container"><svg ref={node => this.node = node}>
        // </svg></div>
    }


}

export default BarChart