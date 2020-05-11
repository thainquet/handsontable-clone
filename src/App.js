/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./App.css";
import Table from "./components/Table";

const data = [
  { id: 1, name: "Wasif", age: 21, email: "wasif@email.com" },
  { id: 2, name: "Ali", age: 19, email: "ali@email.com" },
  { id: 3, name: "Saad", age: 16, email: "saad@email.com" },
  { id: 4, name: "Asad", age: 25, email: "asad@email.com" },
];

const Array2D = (row, col, value) =>
  [...Array(row)].map((x) => Array(col).fill(value));

const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function App() {
  const [rowNum, setRowNum] = useState(20);
  const [colNum, setColNum] = useState(10);
  const [initArray, setInitArray] = useState([]);
  let count = -1;

  const handleClickCreate = () => {
    let arr = [...Array(rowNum)].map((x) => Array(colNum).fill(makeid(5)));
    arr.forEach((i) => {
      i[0] = arr.indexOf(i);
    });
    for (let i = 0; i < arr[0].length; i++) {
      arr[0][i] = ++count;
    }
    setInitArray(arr);
  };

  const handleClickCell = (e) => {
    let tungdo = e.target.parentNode.rowIndex;
    let hoanhdo = e.target.cellIndex;

    let th = e.target
    th.parentNode.parentNode.childNodes.forEach(tr => {
      tr.style.backgroundColor = null
      tr.childNodes.forEach(th => th.style.backgroundColor = null)
    })

    if (e.target.cellIndex === 0) {
      e.target.parentNode.style.backgroundColor = "#e6efff";
    } else {
      e.target.parentNode.style.backgroundColor = ""
      e.target.style.backgroundColor = "#e6efff";
    }
    // console.log("value", initArray[tungdo][hoanhdo]);
  };

  const handleChangeCell = (e) => {
    console.log(e.target.value);
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
      <button onClick={() => handleClickCreate()}>Create</button>
      <div className="scroll">
        <table>
          <tbody>
            {initArray &&
              initArray.map((i) => (
                <>
                  <tr>
                    {i.map((j) => (
                      <th onClick={handleClickCell}>
                        {j}
                      </th>
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
// const App = () => (
//   <div style={{ width: 'max-content' }}>
//     <Table x={50} y={10} />
//   </div>
// )

export default App;
