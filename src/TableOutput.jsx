import React from "react";

export default function TableOutput(props) {
  const parsedCsvData = props.data;
  return (
    <div className="table-output">
      <table>
        <thead>
          <tr>
            <th className="stock-th">Stock</th>
            <th className="broker-th">{props.query}</th>
            <th className="quantity-th">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {parsedCsvData &&
            parsedCsvData.map((data, index) => (
              <tr key={index}>
                <td>{data.Stock}</td>
                <td>{data.Broker}</td>
                <td>{data.Qty}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
