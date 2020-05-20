import React, { useState } from "react";
import "./Table.css";

const Cell = (props) => {
  const { cellData } = props;
  const [localData, setLocalData] = useState(cellData.data);
  const handleCellChange = (e) => {
    setLocalData(e.target.value);
  };
  return (
    <td>
      <input value={localData} onChange={handleCellChange} />
    </td>
  );
};

const Row = (props) => {
  const { rowData } = props;

  const handleClickRow = (e) => {
    e.preventDefault();
    let thisTR = e.target.parentNode.parentNode;
    thisTR.style.border = "2px solid #4b89ff";
  };
  return (
    <tr>
      <td onClick={handleClickRow}>
        <input disabled={true} />
      </td>
      {rowData &&
        rowData.map((i, index) => (
          <Cell key={index} cellData={{ data: i, index }} />
        ))}
    </tr>
  );
};

const Table = (props) => {
  const { tableData } = props;
  const [initArray, setInitArray] = useState([
    ["a", "b", "c", "d", "e", "f", "G"],
    ["q1", "b", "c", "d", "e", "f", "G"],
    ["q2", "b", "c", "d", "e", "f", "G"],
    ["q3", "b", "c", "d", "e", "f", "G"],
    ["a", "b", "c", "d", "e", "f", "G"],
  ]);
  if (tableData) setInitArray(tableData);
  let headerRow = [];
  for (let i = 0; i <= initArray[0].length; i++) {
    headerRow.push(
      <th key={i}>
        <input />
      </th>
    );
  }
  return (
    <table>
      <thead>
        <tr>{headerRow ? headerRow : ""}</tr>
      </thead>
      <tbody>
        {initArray &&
          initArray.map((i, index) => <Row key={index} rowData={i} />)}
      </tbody>
    </table>
  );
};

export default Table;
