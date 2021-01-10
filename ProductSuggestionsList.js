import React from 'react'
import Infobox from "./Infobox";

import selectionLogger from './selectionLogger'
import ListElement from './Charts/List'

import { Grid, Segment, Header } from 'semantic-ui-react'

class ProductSuggestionsList extends React.Component {
  
  constructor(props) {
	  super(props);
	  
	  this.props.resetSearch.bind(this);
  }
  render(){
  
  if (Object.entries(this.props.topDocuments).length !== 0)
  return (
    this.props.topDocuments.map((element, index) => {
      return (
	    <Grid.Column key={index}>
		    <Segment>
			    <ListElement element={element}
				             dataPointClicked= {this.dataPointClicked}
						/>
			</Segment>
		</Grid.Column>
      )
    })
  )
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
	console.log('clicked But!' + e.name)
	// Send selection of hotel to selectionLog
	//const h_id = e.h_id;
	//selectionLogger({h_id});
	
	// clear search results, selection has been made
	//this.props.resetSearch();
  }
  
}

export default ProductSuggestionsList