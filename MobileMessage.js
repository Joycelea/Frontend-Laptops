import React from 'react'

class MobileMessage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Error Message</h1>
                <div>
                    Sorry, the application won't work properly with small screens. Please try to access it from a
                    desktop
                    web
                    browser.
                </div>
            </div>
        );
    }
}

export default MobileMessage;