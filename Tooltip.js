import React from 'react'
import {select} from "d3-selection";
import classNames from "classnames"
import BarChart from "./BarChart";

class Tooltip extends React.Component {
    callables = null;

    constructor(props) {
        super(props);
        this.Classes = classNames('tooltip');
        this.state = {
            data: null,
            display: "none"
        }
    }

    componentDidMount() {
        this.props.setCallables({
            show: this.show,
            hide: this.hide
        });
    }

    setCallables = (callables) => {
        this.callables = callables;
    }

    show = (e, d, x, y) => {
        let self = this
        this.setState({data: d, display: "block"}, function () {
            // console.log(e.clientY, e.screenY,  y, this.node.offsetHeight, window.innerHeight)
            if (e.clientY + this.node.offsetHeight > window.innerHeight) {
                y = y - this.node.offsetHeight
            }
            select(self.node)
                .style("left", (x) + "px")
                .style("top", (y) + "px")
                .transition()
                .duration(200) // ms
                .style("opacity", .95) // started as 0!
            // self.callables.triggerUpdate()
        })
        this.props.onShow(d)
    }
    round = (n) => {
        return Math.round(n * 100) / 100
    }

    hide = (e, d) => {
        select(this.node)
            .transition()
            .duration(300) // ms
            .style("opacity", 0)
            // .attr("height", "0px")
            .attr("width", "0px"); // don't care about position!
        this.setState({display: "none"})
    }

    render() {
        return this.state.data !== null ? (
            <div ref={node => this.node = node} className={this.Classes} style={{"display": this.state.display}}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title">{this.state.data.item.item.productTitle}</h6>
                        </div>
                        <div className="modal-body">

                            <div className="row justify-content-start">
                                <BarChart setCallables={this.setCallables} data={this.state.data}
                                          axises={this.props.axies}></BarChart>

                            </div>
                            <div>Average Rating
                                : {this.round(this.state.data.item.score.calculated_average_rating)} ({this.state.data.item.score.calculated_count_reviews} Reviews)
                            </div>
                            <div style={{"fontSize": "small"}}>(Click on the point for more information)</div>
                        </div>
                    </div>
                </div>

            </div>
        ) : "";
    }
}


export default Tooltip