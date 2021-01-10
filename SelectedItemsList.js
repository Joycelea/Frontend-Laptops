import React from 'react'

const ItemList = props => {
  
  const selectedItems = props.products.map((item, index) => {
	  if(item.isSelected === "1")
          return <li key={index}>{item.productName}</li>
	  return ''
})
  
  return (
        <div>
            <p>You have selected the following products : </p>
			<p>{selectedItems}</p>
         </div>
		
	)
}

const SelectedItemsList = (props) => {
  const { products } = props;

  return (
    <ItemList products={products}/>
  );
}


export default SelectedItemsList