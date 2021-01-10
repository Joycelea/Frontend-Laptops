import React from 'react'

const selectionLogger = props =>
{
  const h_id= props.h_id;
  
  fetch('http://localhost:4000/log', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
		},
		body: JSON.stringify({
				sessionId: window.sessionId,
				h_id: props.h_id
		}),
	}).then(response => response.json())
}

export default selectionLogger