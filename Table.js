import React from 'react'

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Product</th>
        <th>Price</th>
		<th>Select</th>
      </tr>
    </thead>
  )
}

const TableBody = props => {
  const rows = props.products.map((row, index) => {

    return (
      <tr key={index}>
        <td>{row.productName}</td>
        <td>{row.price}</td>
		<td>
		    <button onClick={() => props.selectProduct(index)}>select</button>
        </td>
      </tr>
    )
  })

  return <tbody>{rows}</tbody>
}

const Table = (props) => {
  const { products, selectProduct } = props;

  return (
    <table>
      <TableHeader />
      <TableBody products={products} selectProduct={selectProduct} />
    </table>
  );
}

export default Table