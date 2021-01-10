import React from 'react'
import Screenshot1 from "./images/Screenshot1.png"
import Screenshot2 from "./images/Screenshot2.png"
import Screenshot3 from "./images/Screenshot3.png"
import Screenshot4 from "./images/Screenshot4.png"
import Screenshot5 from "./images/Screenshot5.png"
import Screenshot6 from "./images/Screenshot6.png"
import Screenshot7 from "./images/Screenshot7.png"

class GuidelinesAndConditions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
        }
        this.surveyAnswers = {}
    }

    fireEnable = () => {
        this.setState({enabled: !this.state.enabled})
    }

    confirmRead = () => {
        this.props.confirmRead()
    }
    nextClick = () => {
        this.props.nextTutorial()
    }
    backClick = () => {
        this.props.backTutorial()
    }

    getImage = (tutorialStage) => {
        if (tutorialStage == 1) return Screenshot1;
        else if (tutorialStage == 2) return Screenshot2;
        else if (tutorialStage == 3) return Screenshot3;
        else if (tutorialStage == 4) return Screenshot4;
        else if (tutorialStage == 5) return Screenshot5;
        else if (tutorialStage == 6) return Screenshot6;
        else if (tutorialStage == 7) return Screenshot7;
    }

    render() {
        let tutorialStage = this.props.stage
        if (tutorialStage == 0) {
            return (
                <div
                    className="overlay">
                    <div className="overlay-content"
                         style={{"top": "5%", "left": "15%", "width": "70%"}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Welcome to this user study - Please read
                                    the
                                    guidelines carefully</h4>
                            </div>
                            <div className="modal-body">
                                <p>Thank you for participating.</p>
                                <p>This website demonstrates a search engine that is used for searching items based on
                                    their
                                    user reviews. The
                                    search procedure takes into account analysing the user reviews based on a
                                    four-valued-logic
                                    dependent approach. This analysis considers the <strong>credibility</strong> and
                                    the <strong>sentiment</strong> of the reviews.</p>
                                <p>For this study, we consider the field of laptops. You will be searching the laptop
                                    that
                                    satisfies your needs based on one of 10 aspects/categories. Which are (Performance,
                                    Software,
                                    Design, Storage, Price for value, Screen, Keyboard, Sound, Connectivity,
                                    Battery).</p>
                                <p>In summary, by using this approach, each laptop will be represented by 4 values that
                                    describe the relevance between the aspect you search for and the available
                                    laptops.</p>
                                <p>These values are: </p>
                                <ul>
                                    <li><strong>Positive</strong>: It means how probable that the previous users of the
                                        laptop
                                        have experienced the search aspect positively.
                                    </li>
                                    <li><strong>Negative</strong>: Oppositely, this means how probable that the previous
                                        users
                                        of the laptop have experienced the search aspect negatively.
                                    </li>
                                    <li><strong>Uncertain</strong>: This values reflects the probability of uncertainty
                                        of the
                                        user experience about the searched aspect.
                                    </li>
                                    <li><strong>Inconsistent</strong>: This values reflects the probability of
                                        contradiction of
                                        reviews on the searched aspect.
                                    </li>
                                </ul>

                                <p>You have to perform the search procedure for each one of these 10 aspects. In each
                                    time, you
                                    will be given the results scattered on a diagram. The axes of this diagram represent
                                    one of
                                    these values (by default, it is Positive vs. Negative). It will be possible to
                                    change the
                                    way that the results are represented in. The size of the points on the scatter
                                    differs based
                                    on the number of reviews used in the analysis. And the color is taken from highest
                                    value of
                                    that laptop.</p>
                                <p>By looking to results and exploring the values of each laptop, you should decide
                                    which one of
                                    the laptops is the satisfying option for you needs.</p>
                                <p>Once you finish the task, you will be given a code which is used to confirm your
                                    participation on Amazon Mechanical Turk platform.</p>
                                <p>Before we start, you must agree that the generated information of your usage of this
                                    website
                                    will be used for research projects. If you agree, please click on the button below.
                                    If not,
                                    you can leave the session by closing this browser tab. </p>
                                <p style={{"text-decoration": "underline"}}>Please note that the payment will be
                                    approved only
                                    if the
                                    logs show that the participant has seriously performed the required tasks.</p>

                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="exampleCheck1"
                                           onClick={this.fireEnable} checked={this.state.enabled}></input>
                                    <label className="form-check-label" htmlFor="exampleCheck1">By clicking on continue,
                                        you
                                        declare that you have read the
                                        guidelines, and agree on the condition and you want to participate in this
                                        study.</label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn btn-primary"
                                        data-dismiss="modal" disabled={!this.state.enabled}
                                        onClick={this.confirmRead}>Continue
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            )
        } else if (tutorialStage >= 1 && tutorialStage <= 7) {
            return (
                <div
                    className="overlay">
                    <div className="overlay-content" style={{"top": "5%", "left": "15%", "width": "70%"}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Tutorial {tutorialStage}/7</h4>
                            </div>
                            <div className="modal-body">
                                <img src={this.getImage(tutorialStage)}/>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn btn-primary"
                                        data-dismiss="modal" onClick={this.backClick}>Back
                                </button>
                                <button type="button" className="btn btn btn-primary"
                                        data-dismiss="modal"
                                        onClick={this.nextClick}>{tutorialStage == 7 ? "Start the study" : "Next"}
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            )
        } else if (tutorialStage == 8) {
            return (
                <div
                    className="overlay">
                    <div className="overlay-content" style={{"top": "15%", "left": "25%", "width": "50%"}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Task completed</h4>
                            </div>
                            <div className="modal-body">
                                {
                                    (this.props.remainingQueries.length > 0)
                                        ? <p>Thank you. Please try the system using the next
                                            aspect: <strong>{this.props.remainingQueries[0]}</strong></p>
                                        : <p>Thank you. You have completed all aspects! Final step is to participate in
                                            a short survey. Please click on the button below to start the survey.</p>

                                }
                            </div>

                            <div className="modal-footer">
                                {
                                    (this.props.remainingQueries.length > 0)
                                        ? <div>
                                            <button type="button" className="btn btn btn-primary"
                                                    data-dismiss="modal" onClick={this.props.justHide}>Ok
                                            </button>
                                            <span className="padded"></span>
                                            <button type="button" className="btn btn btn-primary"
                                                    data-dismiss="modal"
                                                    onClick={this.props.goToSurvey}>(This will be removed. Now for testing)
                                                skip other aspects and go to the survey
                                            </button>
                                        </div>
                                        : <button type="button" className="btn btn btn-success"
                                                  data-dismiss="modal"
                                                  onClick={this.props.goToSurvey}>Go to the survey
                                        </button>

                                }


                            </div>

                        </div>
                    </div>

                </div>
            )
        } else if (tutorialStage == 9) {
            return (
                <div
                    className="overlay">
                    <div className="overlay-content" style={{"top": "15%", "left": "25%", "width": "50%"}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Confirm Selection</h4>
                            </div>
                            <div className="modal-body">
                                <p>Your are about to select the laptop that have <ul>
                                    <li>An average
                                        rating <strong>({this.round(this.props.selectedItem.item.score.calculated_average_rating)})</strong>
                                    </li>
                                    <li>And the four valued logic
                                        analysis <strong>(Positive: {this.round(this.props.selectedItem.item.score.true) * 100}%,
                                            Negative: {this.round(this.props.selectedItem.item.score.false) * 100}%,
                                            Uncertain: {this.round(this.props.selectedItem.item.score.unknown) * 100}%
                                            and
                                            Inconsistent: {this.round(this.props.selectedItem.item.score.inconsistent) * 100}%)</strong>
                                    </li>
                                </ul>
                                    As your preferred selection for this aspect: <strong>{this.props.query}</strong>
                                </p>
                                <p>Are you sure about your selection?</p>

                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn btn-danger"
                                        data-dismiss="modal" onClick={this.cancelSelection}>No, I am not sure
                                </button>
                                <button type="button" className="btn btn btn-success"
                                        data-dismiss="modal"
                                        onClick={this.confirmSelection}>Yes. I am sure
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            )
        } else if (tutorialStage == 10) {
            return (
                <div
                    className="overlay">
                    <div className="overlay-content" style={{"top": "15%", "left": "15%", "width": "70%"}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Final Survey</h4>
                            </div>
                            <div className="modal-body">
                                <p>Survey is in progress</p>

                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn btn-success"
                                        data-dismiss="modal" onClick={this.submitSurvey}>Submit
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            )
        } else if (tutorialStage == 11) {
            return (
                <div
                    className="overlay">
                    <div className="overlay-content" style={{"top": "15%", "left": "15%", "width": "70%"}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Payment code</h4>
                            </div>
                            <div className="modal-body">
                                <p>Thank you for participating in our research. Your code is: </p>
                                <p><strong> {this.props.code} </strong></p>
                                <p>Please make sure to copy your code to Amazon MTurk. This code will not be displayed
                                    any more after you close this page.</p>

                            </div>

                        </div>
                    </div>

                </div>
            )
        } else if (tutorialStage == 12) {
            return (

                <div
                    className="overlay">
                    <div className="overlay-content" style={{"top": "15%", "left": "25%", "width": "50%"}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">{this.props.message.title}</h4>
                            </div>
                            <div className="modal-body">
                                <p>{this.props.message.body}</p>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn btn-primary"
                                        data-dismiss="modal" onClick={this.props.justHide}>Ok
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

            )
        } else {
            return ""
        }
    }

    round = (n) => {
        return Math.round(n * 100) / 100
    }

    confirmSelection = () => {
        this.props.onConfirmSelection()
    }


    cancelSelection = () => {
        this.props.onCancelSelection()
    }

    updateRemainingQueries = () => {
        this.props.updateRemainingQueries()
    }

    submitSurvey = () => {
        this.props.submitSurvey(this.surveyAnswers)
    }
}

export default GuidelinesAndConditions;