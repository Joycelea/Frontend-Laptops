import React from 'react'

const Infobox = props => {
  
  var cont = props.content;
  
  return (
    <div id="Infobox">
	    <br/><br/>{cont}
	</div>
  );
}


export default Infobox