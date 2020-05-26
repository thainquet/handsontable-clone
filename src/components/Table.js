import React, { useState, useEffect } from "react";
import "./Table.css";

const clearAllTRBorder = () => {
  Array.prototype.forEach.call(document.querySelectorAll("tr"), function (e) {
    e.classList.remove("rowSelected");
  });
};

const clearAllCellBorder = () => {
  Array.prototype.forEach.call(document.querySelectorAll("td"), function (e) {
    e.classList.remove("cellSelected");
  });
};

const clearAllColumnborder = () => {
  Array.prototype.forEach.call(document.querySelectorAll("th"), function (e) {
    e.classList.remove("selectFirstTH");
  });
  Array.prototype.forEach.call(document.querySelectorAll("td"), function (e) {
    e.classList.remove("columnSelected", "columnSelectedLast");
  });
};

const removeElementsByClass = (className) => {
  var elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const clearAllSelectedCell = () => {
  Array.prototype.forEach.call(document.getElementById("tbl").querySelectorAll("td"), function (e) {
    e.classList.remove("selected");
  });
}

const cleanTable = () => {
  clearAllCellBorder();
  clearAllTRBorder();
  clearAllColumnborder();
  clearAllSelectedCell()
  removeElementsByClass("dot");
};

const Cell = (props) => {
  const { cellData } = props;
  const [localData, setLocalData] = useState(cellData.data);
  const handleCellChange = (e) => {
    setLocalData(e.target.value);
  };
  const handleClickCell = (event) => {
    let rect = event.target.parentNode.getBoundingClientRect();
    cleanTable();
    let dot = document.createElement("DIV");
    dot.innerHTML = "";
    dot.classList.add("dot");
    dot.style.top = rect.bottom - 4 + "px";
    dot.style.left = rect.right - 4 + "px";
    document.getElementsByTagName("BODY")[0].appendChild(dot);

    let value = event.target.value
    console.log(value)

    document.getElementsByClassName("dot")[0].addEventListener('click', function (e) {
      console.log(e.target)
    })

    event.target.parentNode.classList.add("cellSelected");
  };
  return (
    <td className="cellData">
      <input
        value={localData}
        onChange={handleCellChange}
        onClick={handleClickCell}
      />
    </td>
  );
};

const Row = (props) => {
  useEffect(() => {
    let thElm;
    let startOffset;

    Array.prototype.forEach.call(
      document.querySelectorAll("table td#row"),
      function (td) {
        td.style.position = "relative";

        let grip = document.createElement("div");
        grip.innerHTML = "&nbsp;";
        grip.style.bottom = 0;
        grip.style.left = 0;
        grip.style.right = 0;
        grip.style.height = "2px";
        grip.style.position = "absolute";
        grip.style.cursor = "row-resize";
        grip.addEventListener("mousedown", function (e) {
          thElm = td;
          startOffset = td.offsetHeight - e.pageY;
        });

        td.appendChild(grip);
      }
    );

    document.addEventListener("mousemove", function (e) {
      if (thElm) {
        thElm.style.height = startOffset + e.pageY + "px";
      }
    });

    document.addEventListener("mouseup", function () {
      thElm = undefined;
    });
    return () => {
      document.removeEventListener("mousemove", function (e) {
        if (thElm) {
          thElm.style.height = startOffset + e.pageY + "px";
        }
      });
      document.removeEventListener("mouseup", function () {
        thElm = undefined;
      });
    };
  }, []);
  const { rowData, cellSelectedPosition } = props;

  const handleClickRow = (e) => {
    e.preventDefault();
    let thisTR = e.target.parentNode.parentNode;
    cleanTable();
    if (thisTR.tagName === "TR") thisTR.classList.add("rowSelected");
  };
  return (
    <tr>
      <td onClick={handleClickRow} id="row">
        <input disabled={true} />
      </td>
      {rowData &&
        rowData.map((i, index) => <Cell
          key={index}
          cellSelectedPosition={cellSelectedPosition}
          cellData={{ data: i, index }}
        />
        )}
    </tr>
  );
};

const Table = (props) => {
  /*eslint-disable */
  useEffect(() => {
    let thElm;
    let startCellIndex, startRowIndex, endCellIndex, endRowIndex;
    let isMousedown = false;
    Array.prototype.forEach.call(
      document.querySelectorAll("table td.mycol"),
      function (td) {
        td.addEventListener("mousedown", function (e) {
          e.target.click()
          Array.prototype.forEach.call(
            document.getElementById("tbl").querySelectorAll("td"),
            function (e) {
              e.classList.remove("selected");
            }
          );
          thElm = td;
          isMousedown = true;
          startCellIndex = td.cellIndex;
          startRowIndex = td.parentNode.rowIndex;
        });
        document
          .getElementById("tbl")
          .addEventListener("mousemove", function (e) {
            let endElement = document.elementFromPoint(e.pageX, e.pageY);
            if (
              endElement.parentNode.tagName === "TD" &&
              endElement.tagName === "INPUT"
            ) {
              let thisTD = endElement.parentNode;
              let cellIndex = thisTD.cellIndex;
              let rowIndex = thisTD.parentNode.rowIndex;
              let table = document.getElementById("tbl");
              let rowStart, rowEnd, cellStart, cellEnd;

              if (rowIndex < startRowIndex) {
                rowStart = rowIndex;
                rowEnd = startRowIndex;
              } else {
                rowStart = startRowIndex;
                rowEnd = rowIndex;
              }

              if (cellIndex < startCellIndex) {
                cellStart = cellIndex;
                cellEnd = startCellIndex;
              } else {
                cellStart = startCellIndex;
                cellEnd = cellIndex;
              }

              if (isMousedown) {
                Array.prototype.forEach.call(
                  document.getElementById("tbl").querySelectorAll("td"),
                  function (e) {
                    e.classList.remove("selected");
                  }
                );
                for (let i = rowStart; i <= rowEnd; i++) {
                  for (let j = cellStart; j <= cellEnd; j++) {
                    table.rows[i].cells[j].classList.add("selected");
                  }
                }
              }
            }
          });
        document
          .getElementById("tbl")
          .addEventListener("mouseup", function (e) {
            isMousedown = false;
          });
      }
    );
  });
  /*eslint-enable */
  useEffect(() => {
    document.addEventListener("keydown", KeyCheck);
    function empty() {
      let selectedNodes = document
        .getElementById("tbl")
        .getElementsByClassName("selected");
      Array.prototype.forEach.call(selectedNodes, function (selectedOne) {
        let input = selectedOne.childNodes[0];
        input.value = "";
      });
    }
    function KeyCheck(event) {
      var KeyID = event.keyCode;
      switch (KeyID) {
        case 8:
          console.log("backspace");
          empty();
          break;
        case 46:
          console.log("delete");
          empty();
          break;
        default:
          break;
      }
    }
    return () => {
      window.removeEventListener("click", KeyCheck);
    };
  });
  useEffect(() => {
    let thElm;
    let startOffset;

    Array.prototype.forEach.call(
      document.querySelectorAll("table th"),
      function (th) {
        th.style.position = "relative";

        let grip = document.createElement("div");
        grip.innerHTML = "&nbsp;";
        grip.classList.add("resizeColumn");
        grip.addEventListener("mousedown", function (e) {
          thElm = th;
          startOffset = th.offsetWidth - e.pageX;
        });

        th.appendChild(grip);
      }
    );

    document.addEventListener("mousemove", function (e) {
      if (thElm) {
        thElm.style.width = startOffset + e.pageX + "px";
      }
    });

    document.addEventListener("mouseup", function () {
      thElm = undefined;
    });
    return () => {
      document.removeEventListener("mousemove", function (e) {
        if (thElm) {
          thElm.style.width = startOffset + e.pageX + "px";
        }
      });
      document.removeEventListener("mouseup", function () {
        thElm = undefined;
      });
    };
  });

  const { tableData } = props;
  const [initArray, setInitArray] = useState([
    ["a", "b", "c", "d", "e", "f", "G"],
    ["q1", "b", "c", "d", "e", "f", "G"],
    ["q2", "b", "c", "d", "e", "f", "G"],
    ["q3", "b", "c", "d", "e", "f", "G"],
    ["a", "b", "c", "d", "e", "f", "G"],
  ]);
  if (tableData) setInitArray(tableData);
  const selectColumn = (event) => {
    cleanTable();
    let _this = event.target.parentNode;
    let position = _this.cellIndex;
    Array.prototype.forEach.call(document.querySelectorAll("table td.cellData"), function (col) {
      if (col.cellIndex === position) col.classList.add("columnSelected")
      if (col.cellIndex === position && col.parentNode.rowIndex === initArray.length) col.classList.add("columnSelectedLast")
    })
    if (_this.tagName === "TH") _this.classList.add("selectFirstTH");
  };
  let headerRow = [];
  for (let i = 0; i < initArray[0].length; i++) {
    headerRow.push(
      <th key={i} onClick={selectColumn}>
        <input />
      </th>
    );
  }
  return (
    <table id="tbl">
      <thead>
        <tr>
          <th>
            <input disabled />
          </th>
          {headerRow ? headerRow : ""}
        </tr>
      </thead>
      <tbody>
        {initArray &&
          initArray.map((i, index) => (
            <Row key={index} rowData={i} />
          ))}
      </tbody>
    </table>
  );
};

export default Table;
