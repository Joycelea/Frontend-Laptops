import React, {Component} from 'react';
import Tooltip from "./Tooltip";
import './productDetail.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faSearch,
    faStar,
    faStarAndCrescent,
    faStarHalf,
    faStarHalfAlt,
    faStarOfDavid, faStarOfLife
} from '@fortawesome/free-solid-svg-icons'
import {FaBeer, FaRegStar, FaStar, FaStarHalfAlt} from 'react-icons/fa'
import imageNotAvailable from "./images/Image-Not-Available.png"
import BarChart from "./BarChart";

class ProductDetails extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        if (this.props.selectedItem != null) {
            return <div className="col-lg-5">
                <div className="card">
                    <div className="container-fliud">
                        <div className="preview row ">
                            <div className="preview-pic tab-content">
                                <div className="tab-pane active" id="pic-1"><img
                                    src={this.getImage()}/></div>
                            </div>

                        </div>
                        <div className="details row">
                            <div className="product-title">{this.props.selectedItem.item.item.productTitle}</div>

                            <div className="rating">
                                <h5 className="underlined">Average rating:</h5>
                                <span className="stars">
                                    {this.props.selectedItem.item.score.calculated_average_rating >= 1 ?
                                        <FaStar></FaStar> : this.props.selectedItem.item.score.calculated_average_rating >= 0.5 ?
                                            <FaStarHalfAlt></FaStarHalfAlt> : <FaRegStar></FaRegStar>}
                                    {this.props.selectedItem.item.score.calculated_average_rating >= 2 ?
                                        <FaStar></FaStar> : this.props.selectedItem.item.score.calculated_average_rating >= 1.5 ?
                                            <FaStarHalfAlt></FaStarHalfAlt> : <FaRegStar></FaRegStar>}
                                    {this.props.selectedItem.item.score.calculated_average_rating >= 3 ?
                                        <FaStar></FaStar> : this.props.selectedItem.item.score.calculated_average_rating >= 2.5 ?
                                            <FaStarHalfAlt></FaStarHalfAlt> : <FaRegStar></FaRegStar>}
                                    {this.props.selectedItem.item.score.calculated_average_rating >= 4 ?
                                        <FaStar></FaStar> : this.props.selectedItem.item.score.calculated_average_rating >= 3.5 ?
                                            <FaStarHalfAlt></FaStarHalfAlt> : <FaRegStar></FaRegStar>}
                                    {this.props.selectedItem.item.score.calculated_average_rating >= 5 ?
                                        <FaStar></FaStar> : this.props.selectedItem.item.score.calculated_average_rating >= 4.5 ?
                                            <FaStarHalfAlt></FaStarHalfAlt> : <FaRegStar></FaRegStar>}
                                </span>
                                <span
                                    className="proddesc"> (<strong>{this.round(this.props.selectedItem.item.score.calculated_average_rating)}</strong>) based on <strong>{this.props.selectedItem.item.score.calculated_count_reviews}</strong> reviews</span>
                                <div className="padded"></div>
                                <div className="padded"></div>
                                <div className="padded"></div>

                                <h5 className="underlined">Four valued logic analysis of the reviews:</h5>
                                <BarChart data={this.props.selectedItem} axises={this.props.axises}></BarChart>
                                <p className="proddesc">
                                    Among <strong>{this.props.selectedItem.item.score.calculated_count_reviews}</strong> user
                                    reviews on this product, the required information about aspect
                                    (<strong>{this.props.currentQuery}</strong>) has been mentioned positively
                                    in <strong>{this.props.selectedItem.item.score.calculated_num_pluses}</strong> reviews.
                                    Negatively, it is mentioned
                                    in <strong>{this.props.selectedItem.item.score.calculated_num_minuses}</strong> reviews.
                                    And it has not been mentioned at all
                                    in <strong>{this.props.selectedItem.item.score.calculated_count_reviews - this.props.selectedItem.item.score.calculated_num_pluses - this.props.selectedItem.item.score.calculated_num_minuses}</strong> reviews.
                                </p>
                                <p className="proddesc">Based on this, the probability that the required information was
                                    positively experienced
                                    is <strong>{this.round(this.props.selectedItem.item.score.true) * 100}%</strong>. On
                                    the other hand, it is probable that the required information
                                    was <strong>{this.round(this.props.selectedItem.item.score.false) * 100}%</strong> negatively
                                    experienced.
                                    The probability of uncertainty
                                    is <strong>{this.round(this.props.selectedItem.item.score.unknown) * 100}%</strong>.
                                    Also, please note that the reviews on this item were contradicting with a
                                    probability
                                    of <strong>{this.round(this.props.selectedItem.item.score.inconsistent) * 100}%</strong>.
                                </p>
                                <hr/>
                                <p className="proddesc"><span
                                    className="underlined">According to this analysis</span> of the reviews which
                                    shows: <br/>
                                    - Average
                                    rating <strong>({this.round(this.props.selectedItem.item.score.calculated_average_rating)})</strong>
                                    <br/>
                                    - And the four valued logic
                                    analysis <strong>(Positive: {this.round(this.props.selectedItem.item.score.true) * 100}%,
                                        Negative: {this.round(this.props.selectedItem.item.score.false) * 100}%,
                                        Uncertain: {this.round(this.props.selectedItem.item.score.unknown) * 100}% and
                                        Inconsistent: {this.round(this.props.selectedItem.item.score.inconsistent) * 100}%)</strong>
                                    <br/>
                                    Would you select this product for a purchase decision?
                                </p>
                                <div className="row justify-content-center">
                                    <button className="btn btn-success" type="button" onClick={this.proceedSelection}>Yes, this is my selection
                                    </button>
                                    <span className="padded"></span>
                                    <button className="btn btn-danger" type="button" onClick={this.rejectSelection}>No,
                                        let me select another
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        } else return ""
    }

    getImage() {
        console.log(this.props.selectedItem)
        if (typeof this.props.selectedItem.item.item.imagePath !== "undefined")
            return this.props.selectedItem.item.item.imagePath;
        else return imageNotAvailable
    }

    round = (n) => {
        return Math.round(n * 100) / 100
    }


    rejectSelection = () => {
        this.props.fireItemRejected()
    }

    proceedSelection = () =>  {
        this.props.fireItemSelected(this.props.selectedItem)
    }
}

export default ProductDetails;