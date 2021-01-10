import React from 'react'

import { Button } from 'semantic-ui-react'

var clic;

class ListElement extends React.Component {
	
    constructor(props){
		super(props);
		
		this.dataPointClicked = this.props.dataPointClicked.bind(this)
		clic = props.dataPointClicked;
		
		this.state = {
			element: props.element,
			dataPointClicked: props.dataPointClicked
		}
	}
	
	render ()
	{
	  return (
	    <section>
		    {this.state.element.name}
			<Button onClick={clic}>select</Button>
		</section>
	  )
	}
}

//onClick={this.dataPointClicked(this.state.element)}
export default ListElement