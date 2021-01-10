import React, {Component} from 'react'
import {Link, useLocation, BrowserRouter as Router} from "react-router-dom";
import {Grid, Segment, Header} from 'semantic-ui-react'
import queryString from 'query-string'
import Table from './Table'
import Form from './Form'
import SearchBar from './SearchBar'
import ProductSuggestionsScatterChart from './ProductSuggestionsScatterChart'
import ProductSuggestionsList from './ProductSuggestionsList'

import SelectedItemsList from './SelectedItemsList'
import BarChart from "./BarChart";
import D3ZoomableScatter from "./D3ZoomableScatter";
import ProductDetails from "./ProductDetails";
import LoadingOverlay from 'react-loading-overlay';
import Overlay from "./ErrorPage";
import GuidelinesAndConditions from "./GuidelinesAndConditions";
import {Redirect} from 'react-router-dom'

class App extends Component {
    callables = null
    serverURL = "http://127.0.0.1:5000"
    EVENTS = {
        "SEARCH_DEFAULT": "SEARCH_DEFAULT",
        "ITEM_REJECTED": "ITEM_REJECTED",
        "ITEM_SELECTED": "ITEM_SELECTED",
        "ITEM_CLICKED": "ITEM_CLICKED",
        "ITEM_HOVERED": "ITEM_HOVERED",
        "AXIS_CHANGED": "AXIS_CHANGED",
        "SURVEY_SUBMITTED": "SURVEY_SUBMITTED"
    }

    constructor(props) {
        super(props);
        window.sessionId = 'none';
        const isMobile = window.innerWidth <= 500;
        if (isMobile) {
            this.props.history.push('/mobile')
        }

        this.state = {
            topDocuments: [],
            selectedItem: null,
            axises: null,
            isLoading: false,
            query: "",
            tutorialStage: -1,
            remainingQueries: [],
            code: "",
            message: {title: "", body: ""}
        }

        const parameters = queryString.parse(props.location.search)

        if (("q" in parameters && parameters['q'].trim().length > 0)) {
            this.queryAvailable = true;
            this.defaultQuery = parameters['q'].trim()
        } else {
            this.queryAvailable = false
            this.defaultQuery = ""
        }

    }

    componentDidMount() {
        // get Session ID
        this.requestsessionId();
    }

    state = {topDocuments: []}

    setCallables = (callables) => {
        this.callables = callables;
    }

    /*
     * Session
     */

    requestsessionId = (props) => {
        console.log("requesting session id")
        fetch(this.serverURL + '/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                requestsessionId: 'true'
            }),
        }).then(response => response.json())
            .then(data => this.setSession(data));
    }

    setSession = (props) => {
        console.log("session id received", props)
        if (props.loginResult) {
            window.sessionId = props.sessionId
            this.setState({tutorialStage: props.isNewSession ? 0 : -1})
            // if (!props.queriesCompleted) {
            //     this.setState({
            //         message: {
            //             title: "Uncompleted task",
            //             body: "Please continue the search tasks for all aspects."
            //         }, tutorialStage: 12
            //     })
            // }
            //
            // if (!props.surveySubmitted) {
            //     this.setState({
            //         message: {
            //             title: "Uncompleted task",
            //             body: "Please continue the search tasks for all aspects."
            //         }, tutorialStage: 12
            //     })
            // }
            
            if (props.queriesCompleted && props.surveySubmitted) {
                this.props.history.push('/internalServerError')
            }
        }
        if (props.loginResult === 'false') {
            console.log('Getting session failed!')
        }

        console.log("query available", this.queryAvailable)
        if (this.queryAvailable) {
            console.log("search for ", this.defaultQuery)
            this.searchSubmit(this.defaultQuery)
            this.logEvent(this.EVENTS.SEARCH_DEFAULT, this.defaultQuery)
        }
    }

    /*
     * Seach
     */

    searchSubmit = (query) => {
        let self = this
        console.log("initiate search", query)
        if (query.trim().length > 0) {
            this.setState({isLoading: true, query: query, selectedItem: null}, function () {
                fetch(self.serverURL + '/search', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        query: query,
                        sessionId: window.sessionId
                    })
                }).then(response => response.json())
                    .then(data => self.searchResult(data));
            })
        }
    }

    searchResult = (props) => {
        console.log("got search results")
        this.setState({
            topDocuments: []
        })

        if (props.querySuccessful === 'true') {
            this.setState({
                topDocuments: props.response,
                query: props.query
            })
            this.callables.notifyForNewResults();
        }
        if (props.querySuccessful === 'false') {
            this.setState({
                query: "",
                message: {title: "Error Message", body: "Undefined aspect! Please try one of the suggested keywords."},
                tutorialStage: 12
            })
        }
        this.setState({isLoading: false})
    }

    resetSearch = () => {
        this.setState({
            topDocuments: []
        })
        this.forceUpdate()
    }


    onItemSelected = (item, axies) => {
        var self = this
        this.setState({selectedItem: item, axises: axies}, function () {
            self.logEvent(self.EVENTS.ITEM_CLICKED, self.state.selectedItem)
        })

        console.log(this.state)
    }

    onItemRejected = () => {
        this.logEvent(this.EVENTS.ITEM_REJECTED, this.state.selectedItem)
        this.setState({selectedItem: null})
    }
    selectThisItem = (item) => {
        console.log("user has choosen this ", item)
        this.setState({tutorialStage: 9, selectedItem: item})
    }
    itemHovered = (item) => {
        this.logEvent(this.EVENTS.ITEM_HOVERED, item)
    }

    confirmRead = () => {
        fetch(this.serverURL + '/confirmRead', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                sessionId: window.sessionId
            })
        }).then(response => response.json())
            .then(data => this.successConfirm());
    }

    logEvent = (etype, evalue, callback) => {
        fetch(this.serverURL + '/logEvent', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                sessionId: window.sessionId,
                query: this.state.query,
                eventType: etype,
                eventValue: evalue
            })
        }).then(callback)
    }
    axisChanged = (x, y) => {
        this.logEvent(this.EVENTS.AXIS_CHANGED, {"x": x, "y": y})
    }
    updateRemainingQueries = () => {
        fetch(this.serverURL + '/getRemaining', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                sessionId: window.sessionId,
            })
        }).then(response => response.json())
            .then(data => this.doUpdateRemainingQueries(data))
    }

    /*
    * Render webpage
    */
    render() {
        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text={'Searching for laptops where aspect "' + this.state.query + '" is mentioned in their reviews...'}>
                <GuidelinesAndConditions
                    updateRemainingQueries={this.updateRemainingQueries}
                    remainingQueries={this.state.remainingQueries}
                    stage={this.state.tutorialStage}
                    confirmRead={this.confirmRead} nextTutorial={this.tutorialNext}
                    backTutorial={this.tutorialBack}
                    selectedItem={this.state.selectedItem}
                    query={this.state.query}
                    onCancelSelection={this.cancelSelection}
                    onConfirmSelection={this.confirmSelection}
                    justHide={this.justHide}
                    goToSurvey={this.goToSurvey}
                    submitSurvey={this.submitSurvey}
                    code={this.state.code}
                    message={this.state.message}
                >
                </GuidelinesAndConditions>
                <div className="container" style={{height: window.innerHeight}}>
                    <div className="row justify-content-end"><a href="#" onClick={this.resetTutorial}>show guidelines &
                        tutorial</a></div>
                    <div className="header"
                         style={{"display": this.state.query == "" ? "block" : "none"}}>
                        <div className="hero">
                            <h1>Four Valued Logic Based Search Engine</h1>
                            <p>Search items based on the analysis of user reviews</p>
                        </div>
                    </div>
                    <SearchBar onSubmit={this.searchSubmit} defaultQuery={this.defaultQuery}/>
                    {this.state.query != ""
                        ? <div className="row">
                            <D3ZoomableScatter
                                topDocuments={this.state.topDocuments}
                                resetSearch={this.resetSearch}
                                onItemSelected={this.onItemSelected}
                                setCallables={this.setCallables}
                                onItemHovered={this.itemHovered}
                                axisChanged={this.axisChanged}>
                            </D3ZoomableScatter>
                            <ProductDetails
                                selectedItem={this.state.selectedItem}
                                axises={this.state.axises}
                                currentQuery={this.state.query}
                                fireItemRejected={this.onItemRejected}
                                fireItemSelected={this.selectThisItem}>
                            </ProductDetails>
                        </div>
                        : ""
                    }

                </div>

            </LoadingOverlay>
        )

    }

    resetTutorial = () => {
        this.setState({tutorialStage: 0})
    }

    successConfirm = () => {
        this.setState({tutorialStage: this.state.tutorialStage + 1})
    }
    tutorialNext = () => {
        this.setState({tutorialStage: this.state.tutorialStage == 7 ? -1 : this.state.tutorialStage + 1})
    }
    tutorialBack = () => {
        this.setState({tutorialStage: this.state.tutorialStage - 1})
    }
    cancelSelection = () => {
        this.setState({tutorialStage: -1})
    }
    confirmSelection = () => {
        this.logEvent(this.EVENTS.ITEM_SELECTED, this.state.selectedItem, () => {
            this.updateRemainingQueries()
        })


    }

    goToSurvey = () => {
        this.setState({tutorialStage: 10})
    }

    justHide = () => {
        this.setState({tutorialStage: -1})
    }
    getCode = () => {
        fetch(this.serverURL + '/getCode', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                sessionId: window.sessionId,
            })
        }).then(response => response.json())
            .then(data => {
                if (data.result) {
                    this.setState({code: data.code}, () => {
                        this.setState({tutorialStage: 11})
                    })
                }
            })
    }
    submitSurvey = (serveyAnswers) => {
        // fetch request
        this.logEvent(this.EVENTS.SURVEY_SUBMITTED, serveyAnswers, () => {
            this.getCode()
        })

    }

    doUpdateRemainingQueries = (data) => {
        this.setState({remainingQueries: data.remainingQueries}, () => {
            console.log(this.state.remainingQueries)
            this.setState({tutorialStage: 8})
        })
    }
}

export default App