import React from 'react'
import queryString from 'query-string'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'


class SearchBar extends React.Component {

    style = {width: "300px"}

    constructor(props) {
        super(props)
        this.state = {
            query: props.defaultQuery
        }
    }

    handleChange = event => {
        const {name, value} = event.target

        this.setState({
            [name]: value,
        })
    }

    querySubmitted = (event) => {
        event.preventDefault()
        this.props.onSubmit(this.state.query)
        // action = {"./?q=" + this.state.query}
    }

    queryChanged = (event) => {
        const {name, value} = event.target
        this.setState({query: value})
    }

    render() {
        // const {query} = this.state;
        // return (
        //     <form onSubmit={e => {
        //         e.preventDefault();
        //         this.submitForm()
        //     }}>
        //         <label>Search hotels</label>
        //         <input
        //             type="text"
        //             name="query"
        //             id="query"
        //             style={{width: "500px", height: "30px"}}
        //             value={query}
        //             onChange={this.handleChange}/>
        //         <input type="submit" value="Submit" onSubmit={this.submitForm}/>
        //     </form>
        // );
        return (
            <div className="row justify-content-center">
                <div className="col-12">
                    <form onSubmit={this.querySubmitted} className=""> {/*card card-sm}*/}
                        <div className="card-body row no-gutters align-items-center">
                            <div className="col-auto" style={{"padding": "5px"}}>
                                <i className="h4 text-body">
                                    <FontAwesomeIcon icon={faSearch}/>
                                </i>
                            </div>
                            <div className="col">
                                <datalist id="suggestions">
                                    <option value="Performance"></option>
                                    <option value="OS/Software"></option>
                                    <option value="Design"></option>
                                    <option value="Storage"></option>
                                    <option value="Price for value"></option>
                                    <option value="Screen/Display"></option>
                                    <option value="Keyboard"></option>
                                    <option value="Sound/Audio"></option>
                                    <option value="Connectivity"></option>
                                    <option value="Battery"></option>
                                </datalist>
                                <input name="q" id="query" value={this.state.query} onChange={this.queryChanged}
                                       className="form-control form-control-lg form-control-borderless"
                                       type="search" placeholder="Search topics or keywords" list="suggestions"></input>

                            </div>
                            <div className="col-auto" style={{"padding": "5px"}}>
                                <input className="btn btn-lg btn-success" type="submit"
                                       value="Search"></input>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}


export default SearchBar;