import React from 'react'
import ReactDOM from 'react-dom';
import App from './App'
import {Route, BrowserRouter as Router} from 'react-router-dom';
import {Switch} from "react-router";
// import './index.css';
import './allstyles.css'
import 'bootstrap/dist/css/bootstrap.css';
import ErrorPage from "./ErrorPage";
import MobileMessage from "./MobileMessage";
// import './productDetail.css'


const routing = (
    <Router>
        <div>
            <Switch>
                {/*<Route exact path="/" component={App} />*/}
                {/*<Route exact path="/search" component={App} />*/}
                <Route path='/internalServerError' exact={true} component={ErrorPage}/>
                <Route path='/mobile' exact={true} component={MobileMessage}/>
                <Route path='/' component={App}/>
            </Switch>
        </div>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'));