import React, { useState, useEffect } from "react";
import "./Table.css";
import dummyData from "./dummyData.js";
import ContextMenu from "./ContextMenu";

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

const Table = (props) => {
  // handle selected cell background
  useEffect(() => {
    let startCellIndex, startRowIndex;
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
          isMousedown = true;
          startCellIndex = td.cellIndex;
          startRowIndex = td.parentNode.rowIndex;
        });
        const mousemove = function (e) {
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
        };
        document.getElementById("tbl").addEventListener("mousemove", mousemove);
        document
          .getElementById("tbl")
          .addEventListener("mouseup", function (e) {
            isMousedown = false;
          });
      }
    );
  }, []);
  // handle keydown delete and backspace
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
  // resize column
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
  // labeling first column
  useEffect(() => {
    Array.prototype.forEach.call(
      document.querySelectorAll("table td.disabledInput"),
      function (inputTD) {
        inputTD.childNodes[0].classList.add("centered");
        inputTD.childNodes[0].value = inputTD.parentNode.rowIndex;
      }
    );
  });
  const { tableData } = props;
  let beginArr = [];
  let theadData = [
    "ID",
    "Country",
    "Code",
    "Currency",
    "Level",
    "Units",
    "Date",
    "Change",
  ];
  // for (let key in dummyData[0]) theadData.push(key);
  // beginArr.push(theadData);
  dummyData.forEach((item) => {
    let tbodyData = [];
    for (let key in item) {
      let value = item[key];
      tbodyData.push(value);
    }
    beginArr.push(tbodyData);
  });
  const [initArray, setInitArray] = useState(beginArr);
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
  for (let i = 0; i < theadData.length; i++) {
    headerRow.push(
      <th className="boundaryColor" key={i} onClick={selectColumn}>
        <input defaultValue={theadData[i]} />
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
    const handleClickOutsideMenu = () => setVisible(false);
    window.addEventListener("click", handleClickOutsideMenu);
    return () => {
      window.removeEventListener("click", handleClickOutsideMenu);
    };
  }, [visible]);
  // copy paste
  const copyToClipboard = (str) => {
    const el = document.createElement("input");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
  useEffect(() => {
    const handleCopyPaste = (e) => {
      var key = e.which || e.keyCode; // keyCode detection
      var ctrl = e.ctrlKey ? e.ctrlKey : key === 17 ? true : false; // ctrl detection

      if (key === 67 && ctrl) {
        copyToClipboard(e.target.value);
      } else if (key === 86 && ctrl) {
        e.preventDefault();
        navigator.clipboard
          .readText()
          .then((data) => {
            if (e.target.tagName === "TEXTAREA") e.target.value = data;
          })
          .catch((err) => {
            console.error("Failed to read clipboard contents: ", err);
          });
      }
    };
    document
      .getElementById("tbl")
      .addEventListener("keydown", handleCopyPaste, false);
    return () =>
      document
        .getElementById("tbl")
        .removeEventListener("keydown", handleCopyPaste, false);
  });
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
  const handleClickRow = (e) => {
    e.preventDefault();
    let thisTR = e.target.parentNode.parentNode;
    cleanTable();
    if (thisTR.tagName === "TR") {
      thisTR.classList.add("rowSelected");
      e.target.parentNode.classList.add("selectedBoundaryColor");
    }
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
    const mousemove = function (e) {
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
              e.classList.remove("selectedForChangingData", "selected");
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
    };
    document.getElementById("tbl").addEventListener("mousemove", mousemove);
    document.getElementById("tbl").addEventListener("mouseup", function (e) {
      isMousedown = false;
      document
        .getElementById("tbl")
        .removeEventListener("mousemove", mousemove);
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
    <>
      <ContextMenu
        top={top}
        left={left}
        initArray={initArray}
        visible={visible}
        setInitArray={setInitArray}
      />

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
            initArray.map((rowData, index) => (
              // <Row key={index} rowData={rowData} />
              <tr key={index}>
                <td
                  className="disabledInput boundaryColor firstRowCell"
                  onClick={handleClickRow}
                >
                  <input disabled={true} defaultValue="" />
                </td>
                {rowData &&
                  rowData.map((i, index) => (
                    // <Cell key={index} cellData={i} />
                    <td className="cellData mycol" key={index}>
                      <textarea
                        rows="1"
                        cols="15"
                        defaultValue={i}
                        // onChange={handleCellChange}
                        onClick={handleClickCell}
                      />
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
      <br></br>
      <button onClick={exportCSV}>Export CSV</button>
    </>
  );
};

export default Table;
