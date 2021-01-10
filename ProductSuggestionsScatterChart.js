import React from 'react'
import Infobox from "./Infobox";
import ScatterChart from "./Charts/ScatterChart";

import selectionLogger from './selectionLogger'

import { Header } from 'semantic-ui-react'

class ProductSuggestionsScatterChart extends React.Component {
  
  constructor(props) {
	  super(props);
	  this.state = {
        infoboxContent: ''
      };
	  
	  this.props.resetSearch.bind(this);
	  
  }
  
  render(){
	if (Object.entries(this.props.topDocuments).length !== 0)
	  return (
	  <div>
        <Header as='h3' content='Results' />
        <ScatterChart topDocuments={this.props.topDocuments}
                        updateInfobox= {this.updateInfobox.bind(this)}
						emptyInfobox = {this.emptyInfobox.bind(this)}
						dataPointClicked = {this.dataPointClicked.bind(this)}
						/>
		  <Infobox content={this.state.infoboxContent}/>
      </div>
    );
    else
		return '';
  }
  
  updateInfobox(value) {
	
	this.setState(currentState => {
      return { infoboxContent: value.dataPoint.name };
    });
  }
  
  emptyInfobox(value) {
	
	this.setState(currentState => {
      return { infoboxContent: '' };
    });
  }
  
  dataPointClicked(e) {
	// Send selection of hotel to selectionLog
	const h_id = e.dataPoint.h_id;
	selectionLogger({h_id});
	
	// clear search results, selection has been made
	this.props.resetSearch();
  }
  
}



export default ProductSuggestionsScatterChart