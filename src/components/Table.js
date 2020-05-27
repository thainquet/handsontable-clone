import React, { useState, useEffect } from "react";
import "./Table.css";

const clearAllTRBorder = () => {
  Array.prototype.forEach.call(document.querySelectorAll("tr"), function (e) {
    e.classList.remove("rowSelected");
  });
};

const clearAllCellBorder = () => {
  Array.prototype.forEach.call(document.querySelectorAll("td"), function (e) {
    e.classList.remove("columnSelected", "columnSelectedLast", "cellSelected");
  });
};

const clearAllColumnborder = () => {
  Array.prototype.forEach.call(document.querySelectorAll("th"), function (e) {
    e.classList.remove("selectFirstTH", "selectedBoundaryColor");
  });
};

const removeElementsByClass = (className) => {
  var elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const clearAllSelectedCell = () => {
  Array.prototype.forEach.call(document.querySelectorAll("td"), function (e) {
    e.classList.remove(
      "selected",
      "selectedForChangingData",
      "selectedBoundaryColor"
    );
  });
};

const cleanTable = () => {
  clearAllCellBorder();
  clearAllTRBorder();
  clearAllColumnborder();
  clearAllSelectedCell();
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

    let value = event.target.value;
    let td = event.target.parentNode;
    let startCellIndex, startRowIndex;
    let isMousedown = false;
    document
      .getElementById("tbl")
      .rows[td.parentNode.rowIndex].cells[0].classList.add(
        "selectedBoundaryColor"
      );
    document
      .getElementById("tbl")
      .rows[0].cells[td.cellIndex].classList.add("selectedBoundaryColor");

    document
      .getElementsByClassName("dot")[0]
      .addEventListener("mousedown", function (e) {
        isMousedown = true;
        startCellIndex = td.cellIndex;
        startRowIndex = td.parentNode.rowIndex;
      });
    document.getElementById("tbl").addEventListener("mousemove", function (e) {
      let endElement = document.elementFromPoint(e.pageX, e.pageY);
      if (
        endElement.parentNode.tagName === "TD" &&
        endElement.tagName === "TEXTAREA"
      ) {
        let thisTD = endElement.parentNode;
        let cellIndex = thisTD.cellIndex;
        let rowIndex = thisTD.parentNode.rowIndex;
        let table = document.getElementById("tbl");
        let rowStart, rowEnd, cellStart, cellEnd;

        if (rowIndex < startRowIndex) {
          rowStart = rowIndex;
          rowEnd = startRowIndex;
          cellStart = cellEnd = startCellIndex;
        } else if (rowIndex > startRowIndex) {
          rowStart = startRowIndex;
          rowEnd = rowIndex;
          cellStart = cellEnd = startCellIndex;
        } else {
          rowStart = rowEnd = startRowIndex;
          if (cellIndex < startCellIndex) {
            cellStart = cellIndex;
            cellEnd = startCellIndex;
          } else {
            cellStart = startCellIndex;
            cellEnd = cellIndex;
          }
        }
        if (isMousedown) {
          Array.prototype.forEach.call(
            document.getElementById("tbl").querySelectorAll("td"),
            function (e) {
              e.classList.remove("selectedForChangingData");
            }
          );
          for (let i = rowStart; i <= rowEnd; i++) {
            for (let j = cellStart; j <= cellEnd; j++) {
              let thisCell = table.rows[i].cells[j];
              thisCell.classList.add("selectedForChangingData");
            }
          }
        }
      }
    });
    document.getElementById("tbl").addEventListener("mouseup", function (e) {
      isMousedown = false;
      Array.prototype.forEach.call(
        document
          .getElementById("tbl")
          .querySelectorAll("td.selectedForChangingData"),
        function (e) {
          e.childNodes[0].value = value;
        }
      );
    });

    event.target.parentNode.classList.add("cellSelected");
  };
  return (
    <td className="cellData mycol">
      <textarea
        rows="1"
        cols="15"
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
      document.querySelectorAll("table td.firstRowCell"),
      function (td) {
        td.style.position = "relative";

        let grip = document.createElement("div");
        grip.innerHTML = "&nbsp;";
        grip.classList.add("resizeRow");
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
        Array.prototype.forEach.call(thElm.parentNode.childNodes, function (
          td
        ) {
          removeElementsByClass("dot");
          td.style.height = startOffset + e.pageY + "px";
          td.childNodes[0].style.width = "100%";
          td.childNodes[0].style.height = "100%";
        });
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
    if (thisTR.tagName === "TR") {
      thisTR.classList.add("rowSelected");
      e.target.parentNode.classList.add("selectedBoundaryColor");
    }
  };
  return (
    <tr>
      <td
        className="disabledInput boundaryColor firstRowCell"
        onClick={handleClickRow}
      >
        <input disabled={true} />
      </td>
      {rowData &&
        rowData.map((i, index) => (
          <Cell
            key={index}
            cellSelectedPosition={cellSelectedPosition}
            cellData={{ data: i, index }}
          />
        ))}
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
          e.target.click();
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
              endElement.tagName === "TEXTAREA"
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
        Array.prototype.forEach.call(
          document.querySelectorAll("table td"),
          function (td) {
            if (td.cellIndex === thElm.cellIndex) {
              removeElementsByClass("dot");
              td.style.width = startOffset + e.pageY + "px";
              td.childNodes[0].style.width = "100%";
              td.childNodes[0].style.height = "100%";
            }
          }
        );
      }
    });

    document.addEventListener("mouseup", function () {
      thElm = undefined;
    });
    return () => {
      document.removeEventListener("mousemove", function (e) {
        if (thElm) {
          removeElementsByClass("dot");
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
    Array.prototype.forEach.call(
      document.querySelectorAll("table td.cellData"),
      function (col) {
        if (col.cellIndex === position) col.classList.add("columnSelected");
        if (
          col.cellIndex === position &&
          col.parentNode.rowIndex === initArray.length
        )
          col.classList.add("columnSelectedLast");
      }
    );
    if (_this.tagName === "TH")
      _this.classList.add("selectFirstTH", "selectedBoundaryColor");
  };
  let headerRow = [];
  for (let i = 0; i < initArray[0].length; i++) {
    headerRow.push(
      <th className="boundaryColor" key={i} onClick={selectColumn}>
        <input />
      </th>
    );
  }

  const exportCSV = () => {
    let data = [];
    let table = document.getElementById("tbl");
    Array.prototype.forEach.call(table.rows, (row) => {
      let dataItem = [];
      Array.prototype.forEach.call(row.cells, (cell) => {
        if (cell.cellIndex !== 0) dataItem.push(cell.childNodes[0].value);
      });
      data.push(dataItem);
    });
    let arr = JSON.parse(JSON.stringify(data));
    let csvContent =
      "data:text/csv;charset=utf-8," + arr.map((e) => e.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  // For context menu
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const menuStyle = {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    zIndex: "100",
  };
  useEffect(() => {
    const handleRightClick = (event) => {
      event.preventDefault();
      const clickX = event.clientX;
      const clickY = event.clientY;
      setTop(clickY + 5);
      setLeft(clickX + 5);
      document.elementFromPoint(clickX, clickY).click();
      setVisible(true);
    };
    document
      .getElementById("tbl")
      .addEventListener("contextmenu", handleRightClick);
    return () =>
      document
        .getElementById("tbl")
        .removeEventListener("contextmenu", handleRightClick);
  }, [visible]);
  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      setVisible(false);
    };
    window.addEventListener("click", handleClickOutsideMenu);
    return () => {
      window.removeEventListener("click", handleClickOutsideMenu);
    };
  }, [visible]);

  return (
    <>
      <div className={visible ? "menu" : "menu hiden"} style={menuStyle}>
        <div
          className="menu-line"
          data-position="right"
          // onClick={handleInsertColumn}
        >
          Insert column right
        </div>
        <div
          className="menu-line borderBottom"
          data-position="left"
          // onClick={handleInsertColumn}
        >
          Insert column left
        </div>
        <div
          className="menu-line"
          // onClick={handleDeleteColumn}
        >
          Delete this column
        </div>
        <div
          className="menu-line borderBottom"
          // onClick={handleDeleteColumnContent}
        >
          Delete this column content
        </div>
        <div
          className="menu-line borderBottom"
          //  onClick={handleUndo}
        >
          Undo
        </div>
        <div
          className="menu-line"
          data-position="above"
          // onClick={handleInsertRow}
        >
          Insert row above
        </div>
        <div
          className="menu-line borderBottom"
          data-position="below"
          // onClick={handleInsertRow}
        >
          Insert row below
        </div>
        <div
          className="menu-line"
          // onClick={handleDeleteRow}
        >
          Delete this row
        </div>
        <div
          className="menu-line"
          // onClick={handleDeleteRowContent}
        >
          Delete this row content
        </div>
      </div>

      <table id="tbl">
        <thead>
          <tr>
            <th className="disabledInput boundaryColor">
              <input disabled />
            </th>
            {headerRow ? headerRow : ""}
          </tr>
        </thead>
        <tbody>
          {initArray &&
            initArray.map((i, index) => <Row key={index} rowData={i} />)}
        </tbody>
      </table>
      <br></br>
      <button onClick={exportCSV}>Export CSV</button>
    </>
  );
};

export default Table;
