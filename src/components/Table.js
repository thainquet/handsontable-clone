import React, { useState, useEffect } from "react";
import "./Table.css";
import dummyData from "./dummyData.js";
// import ContextMenu from "./ContextMenu";

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
                  e.classList.remove("selected", "selectedBoundaryColor");
                }
              );
              Array.prototype.forEach.call(
                document.getElementById("tbl").querySelectorAll("th"),
                function (e) {
                  e.classList.remove("selectedBoundaryColor");
                }
              );
              for (let i = rowStart; i <= rowEnd; i++) {
                for (let j = cellStart; j <= cellEnd; j++) {
                  table.rows[i].cells[j].classList.add("selected");
                  table.rows[0].cells[j].classList.add("selectedBoundaryColor");
                  table.rows[i].cells[0].classList.add("selectedBoundaryColor");
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
  let [theadData, setTheadData] = useState([
    "Id",
    "Country",
    "Code",
    "Currency",
    "Level",
    "Units",
    "Date",
    "Change",
  ]);
  const [clipBoard, setClipBoard] = useState();
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
      let clickedElement = document.elementFromPoint(clickX, clickY);
      if (
        clickedElement.tagName === "TEXTAREA" ||
        clickedElement.tagName === "INPUT"
      ) {
        document.elementFromPoint(clickX, clickY).click();
        setVisible(true);
      } else setVisible(false);
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
  // resize row
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

  const handleSelectColumn = (event) => {
    cleanTable();
    let _this = event.target.parentNode;
    let position = _this.cellIndex;
    Array.prototype.forEach.call(
      document.querySelectorAll("table td.cellData"),
      function (col) {
        if (col.cellIndex === position)
          col.classList.add("columnSelected", "selected");
        if (
          col.cellIndex === position &&
          col.parentNode.rowIndex === initArray.length
        )
          col.classList.add("columnSelectedLast", "selected");
      }
    );
    if (_this.tagName === "TH")
      _this.classList.add("selectFirstTH", "selectedBoundaryColor");
  };

  const handleSelectRow = (e) => {
    e.preventDefault();
    let thisTR = e.target.parentNode.parentNode;
    cleanTable();
    if (thisTR.tagName === "TR") {
      Array.prototype.forEach.call(
        thisTR.querySelectorAll(".cellData"),
        (cell) => cell.classList.add("selected")
      );
      thisTR.classList.add("rowSelected");
      e.target.parentNode.classList.add("selectedBoundaryColor");
    }
  };
  const handleClickCell = (event) => {
    let rect = event.target.parentNode.getBoundingClientRect();
    cleanTable();
    // const tempArr = JSON.parse(JSON.stringify(initArray));
    // setClipBoard([[...tempArr], [...theadData]]);
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

  const menuStyle = {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    zIndex: "100",
  };
  const handleInsertRow = (event) => {
    event.preventDefault();
    const position = event.target.getAttribute("data-position");
    const thisTextarea = document.elementFromPoint(left - 5, top - 5);
    const indexOfRowAndArrayItem = thisTextarea.parentNode.parentNode.rowIndex;
    let tempArr = JSON.parse(JSON.stringify(initArray));
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard([[...tempArr1], [...theadData]]);
    const lengthItem = tempArr[0].length;
    const Item = new Array(lengthItem).fill("");
    if (position === "below") {
      tempArr.splice(indexOfRowAndArrayItem, 0, Item);
    }
    if (position === "above") {
      tempArr.splice(indexOfRowAndArrayItem - 1, 0, Item);
    }
    setInitArray(tempArr);
  };
  const handleInsertColumn = (event) => {
    event.preventDefault();
    const position = event.target.getAttribute("data-position");
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfCellAndArrayItem = thisTH.parentNode.cellIndex;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard([[...tempArr1], [...theadData]]);

    if (position === "right") {
      tempArr.forEach((el) => {
        el.splice(indexOfCellAndArrayItem, 0, "");
      });
      theadData.splice(indexOfCellAndArrayItem, 0, "");
    }
    if (position === "left") {
      tempArr.forEach((el) => {
        el.splice(indexOfCellAndArrayItem - 1, 0, "");
      });
      theadData.splice(indexOfCellAndArrayItem - 1, 0, "");
    }
    setInitArray(tempArr);
  };

  const handleChangeHeaderCell = (e) => {
    let hoanhdo = e.target.parentNode.cellIndex;
    let data = e.target.value;
    let tempHeader = [...theadData];
    tempHeader[hoanhdo - 1] = data;
    setTheadData(tempHeader);
  };

  const handleChangeCell = (e) => {
    e.preventDefault();
    let tungdo = e.target.parentNode.parentNode.rowIndex;
    let hoanhdo = e.target.parentNode.cellIndex;

    let data = e.target.value;
    let tempArr = [...initArray];
    // let tempArr1 = JSON.parse(JSON.stringify(initArray));
    // console.log(tempArr1);
    // setClipBoard(tempArr1);
    tempArr[tungdo - 1][hoanhdo - 1] = data;
    setInitArray(tempArr);
  };

  const handleDeleteRow = (event) => {
    event.preventDefault();
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfRowAndArrayItem = thisTH.parentNode.parentNode.rowIndex;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard([[...tempArr1], [...theadData]]);
    tempArr.splice(indexOfRowAndArrayItem - 1, 1);

    setInitArray(tempArr);
  };
  const handleDeleteColumn = (event) => {
    event.preventDefault();
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfCellAndArrayItem = thisTH.parentNode.cellIndex;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard([[...tempArr1], [...theadData]]);
    tempArr.forEach((el) => {
      el.splice(indexOfCellAndArrayItem - 1, 1);
    });
    setInitArray(tempArr);
    theadData.splice(indexOfCellAndArrayItem - 1, 1);
    // setTheadData();
  };

  const handleUndo = (e) => {
    e.preventDefault();
    if (clipBoard === undefined) return;
    setInitArray(clipBoard[0]);
    setTheadData(clipBoard[1]);
  };

  //handle drag event
  useEffect(() => {
    Array.prototype.forEach.call(
      document.querySelectorAll("table td.disabledInput"),
      (td) => {
        let coordinate = td.getBoundingClientRect();
        let startIndex = undefined;
        td.addEventListener("mousedown", function () {
          startIndex = td.parentNode.rowIndex;
          startDrag();
        });

        function startDrag() {
          let divA = document.createElement("div");
          divA.id = "A";
          divA.style.position = "absolute";
          divA.style.backgroundColor = "#e6efff";
          divA.style.opacity = "0.5";
          divA.style.zIndex = "-1";
          divA.style.width =
            td.parentNode.getBoundingClientRect().width -
            coordinate.width +
            "px";
          divA.style.height = coordinate.height + "px";
          divA.style.left = coordinate.left + coordinate.width + "px";
          divA.style.top = coordinate.top + "px";
          document.getElementsByTagName("body")[0].appendChild(divA);

          document.onmouseup = finishDrag;
          document.onmousemove = function (e) {
            divA.style.top = divA.offsetTop + e.movementY + "px";
          };
        }
        function finishDrag(e) {
          let endEl = document.elementFromPoint(e.pageX, e.pageY);
          if (endEl.tagName === "INPUT") {
            endEl = endEl.parentNode.parentNode;
            let endIndex = endEl.rowIndex;
            startIndex--;
            endIndex--;
            if (startIndex < endIndex) {
              let temparr = JSON.parse(JSON.stringify(initArray));
              let startRowData = temparr[startIndex];
              temparr.splice(endIndex + 1, 0, startRowData);
              temparr.splice(startIndex, 1);
              setInitArray(temparr);
            }
            if (startIndex > endIndex) {
              let temparr = JSON.parse(JSON.stringify(initArray));
              let startRowData = temparr[startIndex];
              temparr.splice(endIndex + 1, 0, startRowData);
              temparr.splice(startIndex + 1, 1);
              setInitArray(temparr);
            }
          }
          // remove divA after mouseup
          Array.prototype.forEach.call(
            document.querySelectorAll("#A"),
            (thisEl) => {
              thisEl.parentNode.removeChild(thisEl);
            }
          );
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }
    );
  });

  return (
    <>
      <div className={visible ? "menu" : "menu hiden"} style={menuStyle}>
        <div
          className="menu-line"
          data-position="right"
          onClick={handleInsertColumn}
        >
          Insert column right
        </div>
        <div
          className="menu-line borderBottom"
          data-position="left"
          onClick={handleInsertColumn}
        >
          Insert column left
        </div>
        {/* <div
          className="menu-line borderBottom"
          // onClick={handleDeleteColumnContent}
        >
          Delete this column content
        </div> */}
        <div className="menu-line borderBottom" onClick={handleUndo}>
          Undo
        </div>
        <div
          className="menu-line"
          data-position="above"
          onClick={handleInsertRow}
        >
          Insert row above
        </div>
        <div
          className="menu-line borderBottom"
          data-position="below"
          onClick={handleInsertRow}
        >
          Insert row below
        </div>
        <div className="menu-line" onClick={handleDeleteColumn}>
          Delete this column
        </div>
        <div className="menu-line" onClick={handleDeleteRow}>
          Delete this row
        </div>
        {/* <div
          className="menu-line"
          // onClick={handleDeleteRowContent}
        >
          Delete this row content
        </div> */}
      </div>

      <table id="tbl">
        <thead>
          <tr>
            <th className="disabledInput boundaryColor">
              <input disabled />
            </th>
            {theadData.map((th, index) => (
              <th
                className="boundaryColor"
                key={index}
                onClick={handleSelectColumn}
              >
                <input value={th} onChange={handleChangeHeaderCell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {initArray.map((rowData, rindex) => (
            <tr key={rindex}>
              <td
                className="disabledInput boundaryColor firstRowCell"
                onClick={handleSelectRow}
              >
                <input disabled={true} defaultValue="" />
              </td>
              {rowData &&
                rowData.map((columnData, cindex) => (
                  <td
                    className="cellData mycol"
                    key={cindex}
                    // onClick={(e) => {
                    //   console.log(e.target.childNodes[0]);
                    // }}
                  >
                    <textarea
                      rows="1"
                      cols="15"
                      value={columnData}
                      onChange={handleChangeCell}
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
