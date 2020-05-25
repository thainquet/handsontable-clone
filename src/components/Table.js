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

const removeElementsByClass = (className) => {
  var elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const cleanTable = () => {
  clearAllCellBorder();
  clearAllTRBorder();
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

    event.target.parentNode.classList.add("cellSelected");
  };
  return (
    <td>
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
  const { rowData } = props;

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
        rowData.map((i, index) => (
          <Cell key={index} cellData={{ data: i, index }} />
        ))}
    </tr>
  );
};

const Table = (props) => {
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
  const [isInSelectedColumn, setIsInSelectedColumn] = useState(false);
  if (tableData) setInitArray(tableData);
  let headerRow = [];
  for (let i = 0; i < initArray[0].length; i++) {
    headerRow.push(
      <th key={i} onClick={() => setIsInSelectedColumn(true)}>
        <input />
      </th>
    );
  }
  return (
    <table>
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
            <Row key={index} rowData={i} hasSelectedCell={isInSelectedColumn} />
          ))}
      </tbody>
    </table>
  );
};

export default Table;
