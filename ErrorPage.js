import React from 'react'

class ErrorPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>500 - Internal Server Error</h1>
                <div>
                    An error occurred while loading the page. The website will be unavailable temporarily.
                </div>
            </div>
        );
    }
}

export default ErrorPage;