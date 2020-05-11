/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./App.css";
import {
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
} from "react-table";

const data = [
  { id: 1, name: "Wasif", age: 21, email: "wasif@email.com" },
  { id: 2, name: "Ali", age: 19, email: "ali@email.com" },
  { id: 3, name: "Saad", age: 16, email: "saad@email.com" },
  { id: 4, name: "Asad", age: 25, email: "asad@email.com" },
];

const Array2D = (row, col, value) =>
  [...Array(row)].map((x) => Array(col).fill(value));

function App() {
  const [rowNum, setRowNum] = useState(20);
  const [colNum, setColNum] = useState(10);
  const [initArray, setInitArray] = useState([]);

  const handleClick = () => {
    console.log(rowNum, colNum);
    let arr = [...Array(rowNum)].map((x) => Array(colNum).fill(""));
    arr.forEach((i) => {
      i[0] = arr.indexOf(i);
    });
    console.log(arr);
    setInitArray(arr);
  };

  return (
    <div>
      <input
        placeholder="row"
        onChange={(e) => setRowNum(parseInt(e.target.value))}
      />
      <input
        placeholder="column"
        onChange={(e) => setColNum(parseInt(e.target.value))}
      />
      <button onClick={() => handleClick()}>Create</button>
      <div className="scroll-x-able">
        <table>
          <tbody>
            {initArray &&
              initArray.map((i) => (
                <>
                  <tr>
                    {i.map((j) => (
                      <th>{j}</th>
                    ))}
                  </tr>
                </>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
