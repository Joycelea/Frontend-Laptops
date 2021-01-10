import React, {Component} from 'react'
import * as d3 from "d3"
import {select} from "d3-selection";
import Tooltip from "./Tooltip";
import selectionLogger from "./selectionLogger";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faSearchMinus, faSearchPlus} from '@fortawesome/free-solid-svg-icons'
import * as ReactBootstrap from 'react-bootstrap';
import {forEach} from "react-bootstrap/ElementChildren";
import call from "d3-selection/src/selection/call";

class D3ZoomableScatter extends Component {
    callables = null;

    constructor(props) {
        super(props)
        this.createChart = this.createChart.bind(this)
        this.elementWidth = 650
        this.elementHeight = 650
        this.margin = 40
        this.height = 600
        this.width = 600
        this.k = this.height / this.width
        this.scaleFactor = 1
        this.currentScale = this.k
        this.scaleLimits = [this.scaleFactor - 5, this.scaleFactor + 5]
        this.selectedItem = null
        this.XAXIS = {label: "Positive", value: "true"}
        this.YAXIS = {label: "Negative", value: "false"}

        this.state = {
            allAxises: [],
            data: []
        }
    }

    generateRandomData = () => {
        const size = Math.random() * 100
        this.data = [
            {"x": Math.random(), "y": Math.random(), "r": 5, "c": "green"},
            {"x": Math.random(), "y": Math.random(), "r": 5, "c": "purple"},
            {"x": Math.random(), "y": Math.random(), "r": 5, "c": "red"},
        ];
        for (var i = 0; i < size; i++) {
            this.data = this.data.concat({"x": Math.random(), "y": Math.random(), "r": 5, "c": "green"})
        }
    }

    setCallables = (callables) => {
        this.callables = callables;
    }

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     if (this.props.topDocuments === nextProps.topDocuments) return false
    //     else return true
    // }

    componentDidMount() {
        this.props.setCallables({
            notifyForNewResults: this.notifyForNewResults
        });
        // if (Object.entries(this.props.topDocuments).length !== 0) {
        //     this.data = this.dataTransform()
        //     // this.generateRandomData()
        //     this.createChart()
        // }
    }

    notifyForNewResults = () => {
        if (Object.entries(this.props.topDocuments).length !== 0) {
            this.dataTransform()
            // this.generateRandomData()

        }
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //
    // }

    dataTransform() {
        console.log("data transformation regarding to ", this.XAXIS, this.YAXIS)
        var self = this;
        console.log(this.state.allAxises)
        var colors = {"true": "green", "false": "red", "unknown": "gray", "inconsistent": "blue", "none": "white"}

        const getMax = object => {
            return Object.keys(object).filter(x => {
                return object[x] == Math.max.apply(null,
                    Object.values(object));
            });
        };

        function getMajor(score) {
            var filtered = Object.keys(score).reduce(function (filtered, key) {
                if (key == "true" || key == "false" || key == "unknown" || key == "inconsistent") filtered[key] = score[key];
                return filtered;
            }, {});
            var major = getMax(filtered)
            if (major.length > 1) major = "none"
            return major
        }

        var mapped = this.props.topDocuments.map(function (item) {
            let index = item.index
            let row = item.item
            var score = item['score']
            var x = score[self.XAXIS.value]
            var y = score[self.YAXIS.value]
            var m = getMajor(score)
            var c = colors[m]
            var o = m == "none" ? 1 : score[m]
            var r = score['calculated_count_reviews'] / 20
            return {"x": x, "y": y, "r": r, "c": c, "o": o, "item": item};
        });

        const xs = mapped.map(point => (parseFloat(point.x)))
        const ys = mapped.map(point => (parseFloat(point.y)))
        this.centX = d3.min(xs) + (d3.max(xs) - d3.min(xs)) / 2;
        this.centY = d3.min(ys) + (d3.max(ys) - d3.min(ys)) / 2;
        var minx = Math.abs(d3.min(xs) - d3.max(xs))
        var miny = Math.abs(d3.min(ys) - d3.max(ys))
        var maxdistance = d3.max([minx, miny])

        if (maxdistance > 0) {
            this.scaleFactor = 0.90 / maxdistance
        } else {
            this.scaleFactor = 3
        }
        mapped.forEach(function (obj) {
            obj.r = obj.r * (1 / self.scaleFactor * 10)
        });

        this.scaleLimits = [this.scaleFactor - 5, this.scaleFactor + 5]

        let mapAxises = function (keys) {
            var axies = []
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == "true") axies.push({"label": "Positive", "value": keys[i]})
                else if (keys[i] == "false") axies.push({"label": "Negative", "value": keys[i]})
                else if (keys[i] == "unknown") axies.push({"label": "Uncertain", "value": keys[i]})
                else if (keys[i] == "inconsistent") axies.push({"label": "Inconsistent", "value": keys[i]})
            }
            return axies
        }

        this.setState({
            data: mapped,
            allAxises: mapAxises(Object.keys(this.props.topDocuments[0]["score"]))
        }, function () {
            self.createChart()
        })
    }

    dataPointClicked(e) {
        // Send selection of hotel to selectionLog
        const h_id = e.dataPoint.h_id;
        selectionLogger({h_id});

        // clear search results, selection has been made
        this.props.resetSearch();
    }

    createChart() {
        console.log("create chart")
        const node = this.node
        d3.select(node).selectAll("*").remove();
        // var margin = {top: 20, right: 20, bottom: 40, left: 60},
        //     width = 460 - margin.left - margin.right,
        //     height = 400 - margin.top - margin.bottom;

        var self = this;

        //center point for testing
        // this.data = this.data.concat({"x": this.centX, "y": this.centY, "r": 10, "c": "white"})


        select(node).attr("viewBox", [-this.margin * 2, 0, this.elementWidth + this.margin, this.elementHeight + this.margin]);

        this.y = d3.scaleLinear()
            .domain([0, 1])
            .range([this.height, 0])

        this.x = d3.scaleLinear()
            .domain([0, 1])
            .range([0, this.width])

        let opacityScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0.2, 1])

        let xAxis = (g, x) => g
            .attr("transform", `translate(0,${this.height})`)
            .call(d3.axisBottom(x).ticks(12))
        // .call(g => g.attr("background-color", "red"))

        let yAxis = (g, y) => g
            .call(d3.axisLeft(y).ticks(12 * this.k))
        // .call(g => g.select(".domain").attr("display", "none"))

        let grid = function (g, x, y) {
            g.attr("fill", "lightgray")
            let poly = [{"x": 0, "y": 0},
                {"x": 0, "y": 1},
                {"x": 1, "y": 0}];
            g.selectAll("polygon")
                .data([poly])
                .join(
                    enter => enter.append("polygon"),
                    update => update,
                    exit => exit.remove()
                )
                .attr("points", function (d) {
                    return d.map(function (d) {
                        return [x(d.x), y(d.y)].join(",");
                    }).join(" ");
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            g.attr("stroke", "currentColor").attr("stroke-opacity", 0.1);
            g.call(g => g
                .selectAll(".x")
                .data(x.ticks(12))
                .join(
                    enter => enter.append("line").attr("class", "x").attr("y2", self.height),
                    update => update,
                    exit => exit.remove()
                )
                .attr("x1", d => 0.5 + x(d))
                .attr("x2", d => 0.5 + x(d)));
            g.call(g => g
                .selectAll(".y")
                .data(y.ticks(12 * self.k))
                .join(
                    enter => enter.append("line").attr("class", "y").attr("x2", self.width),
                    update => update,
                    exit => exit.remove()
                )
                .attr("y1", d => 0.5 + y(d))
                .attr("y2", d => 0.5 + y(d)));


            g.selectAll(".dashed-line")
                .data([[0, 1, 1, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
                .join(
                    enter => enter.append("line").attr("class", 'dashed-line').attr("stroke-opacity", 0.8),
                    update => update,
                    exit => exit.remove()
                )
                .attr('x1', d => x(d[0]))
                .attr("y1", d => y(d[1]))
                .attr('x2', d => x(d[2]))
                .attr("y2", d => y(d[3]))

            return g;

        }

        var prevSelectedPoint = null

        function itemSelected(e, d) {
            console.log("item selected")
            self.selectedItem = d;
            if (prevSelectedPoint !== null) {
                d3.select(prevSelectedPoint).attr("stroke", "black");
                d3.select(prevSelectedPoint).transition().duration('100').attr("r", datum => datum.r);
            }
            d3.select(this).attr("stroke", "orange");
            d3.select(this).transition().duration('100').attr("r", d.r + d.r / 4);

            prevSelectedPoint = this
            self.props.onItemSelected(d, self.state.allAxises)
        }

        function mouseOver(e, d) {
            // console.log(d)
            // d3.select(this).style("cursor", "pointer");
            if (self.selectedItem !== d) {
                d3.select(this).raise();
                // d3.select(this).attr("stroke", "blue");
                d3.select(this).transition().duration('100').attr("r", d.r + d.r / 4);
            }

            var Bounding = self.node.getBoundingClientRect()
            self.callables.show(e, d, e.clientX - Bounding.x + 25, e.clientY - Bounding.y + 25)
        }

        function mouseOut(e, d) {
            // d3.select(this).style("cursor", "default");
            if (self.selectedItem !== d) {
                d3.select(this).lower();
                // d3.select(this).attr("stroke", "black");
                d3.select(this).transition().duration('100').attr("r", d.r);
            }
            self.callables.hide(e, d)
        }


        const gGrid = select(node).append("g")

        const gDot = select(node).append("g")

        const blocky = select(node).append("rect")
            .attr("x", -this.margin * 2)
            .attr("y", 0)
            .attr("height", this.elementHeight + this.margin)
            .attr("width", this.margin * 2)
            .style("fill", 'white');

        const blockx = select(node).append("rect")
            .attr("x", -this.margin * 2)
            .attr("y", this.height)
            .attr("height", this.elementHeight + this.margin - this.height)
            .attr("width", this.elementWidth + this.margin)
            .style("fill", 'white');

        const gx = select(node).append("g");

        const gy = select(node).append("g");
        // x axis label:
        select(node).append("text")
            .attr("text-anchor", "end")
            .attr("x", this.width)
            .attr("y", this.height + this.margin)
            .text(this.XAXIS.label);

        // Y axis label:
        select(node).append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -this.margin)
            .attr("x", -this.margin)
            .text(this.YAXIS.label)


        function zoomed({transform}) {
            self.currentScale = transform.k
            const zx = transform.rescaleX(self.x).interpolate(d3.interpolateRound);
            const zy = transform.rescaleY(self.y).interpolate(d3.interpolateRound);
            gGrid.call(grid, zx, zy);
            gx.call(xAxis, zx);
            gy.call(yAxis, zy);
            gDot.attr("transform", transform).attr("stroke-width", 5 / transform.k);
        }

        gDot.selectAll("dot")
            .data(self.state.data)
            .enter()
            .append("circle")
            .attr("class", "myCircle")
            .attr("cx", d => self.x(d.x))
            .attr("cy", d => self.y(d.y))
            .attr("r", d => d.r)
            .attr("stroke", "black")
            .attr("stroke-width", d => d.r / 6)
            .attr("fill", d => d.c)
            .attr("opacity", d => opacityScale(d.o))
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)
            .on("click", itemSelected)


        let legendH = 170, legendW = 180
        // draw legend
        let legend = select(node)
            .append("g")
            .attr("class", "legend")
            .attr(
                "transform",
                "translate(" + (this.elementWidth - this.margin - legendW) + "," + this.margin + ")"
            );

        // legend background
        let legendBox = legend
            .append("rect")
            .attr("class", "legend-box")
            .attr("x", "-1em")
            .attr("y", "-1.5em")
            .attr("width", legendW)
            .attr("height", legendH);

        // draw legend title
        legend
            .append("text")
            .attr("class", "legend-label")
            .attr("transform", "translate(-11," + -5 + ")")
            .text("Majority of reviews are: ");

        // add wrapper for legend items
        legend = legend
            .selectAll()
            .data([{"label": "Positive", "c": "green"}, {"label": "Negative", "c": "red"},
                {"label": "Uncertain", "c": "gray"}, {"label": "Inconsistent", "c": "blue"}, {
                    "label": "No Majority",
                    "c": "white"
                }])
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr(
                "transform",
                (d, i) =>
                    "translate(" + 0 + "," + (15 + (i * legendH / 6)) + ")"
            );

        // draw legend colored rectangles
        legend
            .append("circle")
            .attr("r", 8)
            .attr("stroke", "black")
            .attr("stroke-width", "1")
            .style("fill", d => d.c);

        // draw legend text
        legend
            .append("text")
            .attr("x", 20)
            .attr("y", 0)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(d => d.label);


        // select(gGrid).selectAll().lower()
        this.zoom = d3.zoom()
            .scaleExtent(this.scaleLimits)
            .on("zoom", zoomed);
        this.transform = d3.zoomIdentity.scale(this.scaleFactor).translate((-this.x(this.centX) + this.width / this.scaleFactor / 2), (-this.y(this.centY) + this.width / this.scaleFactor / 2))
        select(node).call(this.zoom).call(this.zoom.transform, this.transform);
    }

    resetView = (props) => {
        select(this.node).transition()
            .duration(750)
            .call(this.zoom.transform, this.transform);
    }

    zoomIn = () => {
        if (this.currentScale < this.scaleLimits[1]) {
            this.currentScale = this.currentScale + 1
            var transform = d3.zoomIdentity.scale(this.currentScale).translate((-this.x(this.centX) + this.width / this.currentScale / 2), (-this.y(this.centY) + this.width / this.currentScale / 2))
            select(this.node).transition()
                .duration(750)
                .call(this.zoom.transform, transform);
        }
    }
    zoomOut = () => {
        if (this.currentScale > 1) {
            this.currentScale = this.currentScale - 1
            var transform = d3.zoomIdentity.scale(this.currentScale).translate((-this.x(this.centX) + this.width / this.currentScale / 2), (-this.y(this.centY) + this.width / this.currentScale / 2))
            select(this.node).transition()
                .duration(750)
                .call(this.zoom.transform, transform);
        }
    }

    axisChanged = (axis, value) => {
        if (axis === "x") {
            this.XAXIS = value
        } else if (axis === "y") {
            this.YAXIS = value
        }
        if (this.XAXIS.value != this.YAXIS.value) {
            this.notifyForNewResults()
            this.props.axisChanged(this.XAXIS.value, this.YAXIS.value)
        }
    }

    tooltipShown = (item) => {
        this.props.onItemHovered(item)
    }

    render() {
        var self = this;
        if (this.state.data.length > 0) {
            return (
                <div className="col-lg-7">

                    <div className="row justify-content-end">
                        <ReactBootstrap.Dropdown>
                            <ReactBootstrap.Dropdown.Toggle variant="primary" id="dropdown-basic-1">
                                On Y-Axis ({self.YAXIS.label})
                            </ReactBootstrap.Dropdown.Toggle>
                            <ReactBootstrap.Dropdown.Menu>
                                {self.state.allAxises.map(function (value) {
                                    return <ReactBootstrap.Dropdown.Item key={value.value + "_y"}
                                                                         onClick={() => self.axisChanged("y", value)}>{value.label}</ReactBootstrap.Dropdown.Item>
                                })}
                            </ReactBootstrap.Dropdown.Menu>
                        </ReactBootstrap.Dropdown>
                        <span style={{"padding": "5px"}}></span>
                        <ReactBootstrap.Dropdown>
                            <ReactBootstrap.Dropdown.Toggle variant="primary" id="dropdown-basic-2">
                                On X-Axis ({self.XAXIS.label})
                            </ReactBootstrap.Dropdown.Toggle>
                            <ReactBootstrap.Dropdown.Menu>
                                {self.state.allAxises.map(function (value) {
                                    return <ReactBootstrap.Dropdown.Item key={value.value + "_x"}
                                                                         onClick={() => self.axisChanged("x", value)}>{value.label}</ReactBootstrap.Dropdown.Item>
                                })}
                            </ReactBootstrap.Dropdown.Menu>
                        </ReactBootstrap.Dropdown>
                    </div>
                    <Tooltip onShow={this.tooltipShown} setCallables={this.setCallables} axies={this.state.allAxises}></Tooltip>
                    <svg ref={node => this.node = node}></svg>
                    <div className="row justify-content-center">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button title="Zoom Out" onClick={this.zoomOut} type="button" className="btn btn-danger">
                                <FontAwesomeIcon
                                    icon={faSearchMinus}/></button>
                            <button title="Reset Zoom" onClick={this.resetView} type="button"
                                    className="btn btn-primary">
                                <FontAwesomeIcon
                                    icon={faSearch}/></button>

                            <button title="Zoom In" onClick={this.zoomIn} type="button" className="btn btn-success">
                                <FontAwesomeIcon
                                    icon={faSearchPlus}/></button>
                        </div>
                        <span style={{"padding": "5px"}}></span>
                    </div>
                </div>
            );
        } else {
            return "";
        }

    }


}

export default D3ZoomableScatter