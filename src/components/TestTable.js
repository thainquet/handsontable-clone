/* eslint-disable */
import React, { useState, useEffect, useRef, memo } from "react";
import "./Table.css";
import dummyData from "./dummyData.js";

// let thingsToCopy = [];

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
  removeElementsByClass("outlineDiv");
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
      }
    );

    const mousemove = function (e) {
      let endElement = document.elementFromPoint(e.pageX, e.pageY);
      if (endElement !== null && endElement.tagName === "TD") {
        let thisTD = endElement;
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
    document.getElementById("tbl").addEventListener("mouseup", function (e) {
      isMousedown = false;
    });
  }, []);
  // handle keydown delete and backspace
  const hasSelectedCells = () => {
    return document.getElementById("tbl").getElementsByClassName("selected")
      .length > 0 &&
      document.getElementById("tbl").getElementsByClassName("cellSelected")
        .length === 1
      ? true
      : false;
  };
  useEffect(() => {
    document.addEventListener("keydown", KeyCheck);
    function empty() {
      let tempArr1 = JSON.parse(JSON.stringify(initArray));
      setClipBoard([[...tempArr1], [...theadData]]);
      let selectedNodes = document
        .getElementById("tbl")
        .getElementsByClassName("selected");
      let tempArr = [...initArray];
      Array.prototype.forEach.call(selectedNodes, function (selectedOne) {
        let tungdo = selectedOne.parentNode.rowIndex;
        let hoanhdo = selectedOne.cellIndex;
        tempArr[tungdo - 1][hoanhdo - 1] = "";
      });
      setInitArray(tempArr);
    }
    function KeyCheck(event) {
      var KeyID = event.keyCode;
      switch (KeyID) {
        case 8:
          if (hasSelectedCells()) empty();
          break;
        case 46:
          if (hasSelectedCells()) empty();
          break;
        default:
          break;
      }
    }
    return () => {
      window.removeEventListener("click", KeyCheck);
    };
  }, []);
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
  }, []);
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
  let maxColumnAmount = Math.floor((window.screen.width - 50) / 125);
  if (theadData.length < maxColumnAmount) {
    for (let i = theadData.length; i < maxColumnAmount; i++) {
      theadData.push("");
    }
    initArray.forEach((el) => {
      for (let i = el.length; i < maxColumnAmount; i++) {
        el.push("");
      }
    });
    let maxRowAmount = Math.floor((window.innerHeight - 53) / 24);
    if (initArray.length < maxRowAmount) {
      for (let i = initArray.length; i < maxRowAmount; i++) {
        initArray.push(new Array(maxColumnAmount).fill(""));
      }
    }
  }

  const exportCSV = () => {
    let data = [];
    let table = document.getElementById("tbl");
    let lastColumnIndex = theadData.filter((i) => i !== "").length;
    // console.log(lastColumnIndex);
    Array.prototype.forEach.call(table.rows, (row) => {
      let dataItem = [];
      Array.prototype.forEach.call(row.cells, (cell) => {
        if (cell.cellIndex !== 0 && cell.cellIndex <= lastColumnIndex)
          dataItem.push(cell.childNodes[0].value);
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
    str = JSON.stringify(str);
    const el = document.createElement("input");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
  useEffect(() => {
    function copyMultiLine(subArr, arr, ioff, joff) {
      subArr.forEach((r, i) =>
        r.forEach((v, j) => (arr[ioff + i][joff + j] = v))
      );
    }
    const handleCopyPaste = (e) => {
      var key = e.which || e.keyCode; // keyCode detection
      var ctrl = e.ctrlKey ? e.ctrlKey : key === 17 ? true : false; // ctrl detection

      if (key === 67 && ctrl) {
        let table = document.getElementById("tbl");
        let allRows = Array.from(table.rows);
        let result = [];
        allRows.forEach((row) => {
          let temp = [];
          let allCells = Array.from(row.childNodes);
          allCells.forEach((cell) => {
            if (
              cell.tagName !== "TH" &&
              cell.cellIndex !== 0 &&
              (cell.className.indexOf("selected") !== -1 ||
                cell.className.indexOf("cellSelected") !== -1)
            )
              temp.push(cell);
          });
          if (temp.length > 0) result.push(temp);
        });
        // Array of Node to Array of value
        result = result.map((i) => i.map((j) => j.textContent));
        copyToClipboard(result);
      } else if (key === 86 && ctrl) {
        e.preventDefault();
        navigator.clipboard
          .readText()
          .then((data) => {
            data = JSON.parse(data);
            console.log(data);
            if (e.target.tagName === "TD") {
              let rowIndex = e.target.parentNode.rowIndex;
              let cellIndex = e.target.cellIndex;
              let tempArr = [...initArray];
              if (cellIndex - 1 + data[0].length > tempArr[0].length) {
                let num = cellIndex - 1 + data[0].length - tempArr[0].length;
                while (num-- > 0) {
                  tempArr.forEach((el) => {
                    el.splice(cellIndex, 0, "");
                  });
                  theadData.splice(cellIndex, 0, "");
                }
              }
              if (rowIndex - 1 + data.length > tempArr.length) {
                let num = rowIndex - 1 + data.length - tempArr.length;
                const lengthItem = tempArr[0].length;
                const Item = new Array(lengthItem).fill("");
                while (num-- > 0) {
                  tempArr.splice(rowIndex, 0, Item);
                }
              }
              copyMultiLine(data, tempArr, rowIndex - 1, cellIndex - 1);
              setInitArray(tempArr);
            }
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
    }
  };
  const handleClickCell = (event) => {
    event.stopPropagation();
    let td = event.target;
    if (td.tagName !== "TD") return;
    let rowIndex = td.parentNode.rowIndex;
    let cellIndex = td.cellIndex;
    let rect = td.getBoundingClientRect();
    cleanTable();
    const tempArr = JSON.parse(JSON.stringify(initArray));
    setClipBoard([[...tempArr], [...theadData]]);

    let dot = document.createElement("DIV");
    dot.innerHTML = "";
    dot.classList.add("dot");
    dot.style.top = rect.height - 5 + "px";
    dot.style.left = rect.width - 5 + "px";
    td.appendChild(dot);

    let value = td.textContent;
    let startCellIndex, startRowIndex;
    let isMousedown = false;
    td.parentNode.cells[0].classList.add("selectedBoundaryColor");
    document
      .getElementById("tbl")
      .rows[0].cells[cellIndex].classList.add("selectedBoundaryColor");

    // document
    //   .getElementsByClassName("dot")[0]
    //   .addEventListener("mousedown", function (e) {
    //     clearAllSelectedCell();
    //     isMousedown = true;
    //     startCellIndex = td.cellIndex;
    //     startRowIndex = td.parentNode.rowIndex;
    //   });
    // const mousemove = function (e) {
    //   let endElement = document.elementFromPoint(e.pageX, e.pageY);
    //   if (
    //     endElement !== null &&
    //     endElement.parentNode.tagName === "TD" &&
    //     endElement.tagName === "TEXTAREA"
    //   ) {
    //     let thisTD = endElement.parentNode;
    //     let cellIndex = thisTD.cellIndex;
    //     let rowIndex = thisTD.parentNode.rowIndex;
    //     let table = document.getElementById("tbl");
    //     let rowStart, rowEnd, cellStart, cellEnd;

    //     if (rowIndex < startRowIndex) {
    //       rowStart = rowIndex;
    //       rowEnd = startRowIndex;
    //       cellStart = cellEnd = startCellIndex;
    //     } else if (rowIndex > startRowIndex) {
    //       rowStart = startRowIndex;
    //       rowEnd = rowIndex;
    //       cellStart = cellEnd = startCellIndex;
    //     } else {
    //       rowStart = rowEnd = startRowIndex;
    //       if (cellIndex < startCellIndex) {
    //         cellStart = cellIndex;
    //         cellEnd = startCellIndex;
    //       } else {
    //         cellStart = startCellIndex;
    //         cellEnd = cellIndex;
    //       }
    //     }
    //     if (isMousedown) {
    //       Array.prototype.forEach.call(
    //         document.getElementById("tbl").querySelectorAll("td"),
    //         function (e) {
    //           e.classList.remove("selectedForChangingData", "selected");
    //         }
    //       );
    //       for (let i = rowStart; i <= rowEnd; i++) {
    //         for (let j = cellStart; j <= cellEnd; j++) {
    //           let thisCell = table.rows[i].cells[j];
    //           thisCell.classList.add("selectedForChangingData");
    //         }
    //       }
    //     }
    //   }
    // };

    // const mouseup = (e) => {
    //   isMousedown = false;
    //   document
    //     .getElementById("tbl")
    //     .removeEventListener("mousemove", mousemove);
    //   let tempArr = [...initArray];
    //   Array.prototype.forEach.call(
    //     document
    //       .getElementById("tbl")
    //       .querySelectorAll("td.selectedForChangingData"),
    //     function (td) {
    //       let tungdo = td.parentNode.rowIndex;
    //       let hoanhdo = td.cellIndex;
    //       tempArr[tungdo - 1][hoanhdo - 1] = value;
    //     }
    //   );
    //   setInitArray(tempArr);
    //   document.getElementById("tbl").removeEventListener("mouseup", mouseup);
    // };
    // document.getElementById("tbl").addEventListener("mousemove", mousemove);
    // document.getElementById("tbl").addEventListener("mouseup", mouseup, false);
    event.target.classList.add("cellSelected");
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
    let td = e.target;
    let rect = td.getBoundingClientRect();
    let table = document.getElementById("tbl");

    let tempTextarea = document.createElement("TEXTAREA");
    let tempParent = document.createElement("DIV");
    //
    tempParent.style.position = "absolute";
    tempParent.style.top = rect.top + 1 + "px";
    tempParent.style.left = rect.left + 1 + "px";
    tempParent.style.width = rect.width - 2 + "px";
    tempParent.style.height = rect.height - 2 + "px";
    //
    tempTextarea.style.width = "100%";
    tempTextarea.id = "newTextarea";
    tempTextarea.rows = "1";
    tempTextarea.style.padding = "0";
    //
    tempParent.appendChild(tempTextarea);
    table.append(tempParent);
    //
    tempTextarea.value = td.textContent;
    td.textContent = "";
    tempTextarea.focus();

    let tx = tempTextarea;
    tx.parentNode.style.height = tx.scrollHeight + "px;overflow-y:hidden;";
    tx.addEventListener("input", OnInput);

    function OnInput(e) {
      tx.parentNode.style.height = "auto";
      tx.parentNode.style.height = e.target.scrollHeight + "px";
    }

    let tungdo = e.target.parentNode.rowIndex;
    let hoanhdo = e.target.cellIndex;
    let tempArr = [...initArray];

    tempTextarea.onblur = function (e) {
      td.style.height = e.target.scrollHeight + "px";
      tempArr[tungdo - 1][hoanhdo - 1] = e.target.value;
      setInitArray(tempArr);
      table.removeChild(tempParent);
    };
  };

  // useEffect(() => {
  //   let allTD = document.querySelectorAll("table td");
  //   Array.prototype.forEach.call(allTD, (td) => {
  //     // min scrollHeight = 23 <> 1 rows
  //     if (td.childNodes[0].scrollHeight > 30) {
  //       td.style.height = td.childNodes[0].scrollHeight + 2 + "px";
  //     }
  //   });
  // });

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
  };

  const handleUndo = (e) => {
    e.preventDefault();
    if (clipBoard === undefined) return;
    setInitArray(clipBoard[0]);
    setTheadData(clipBoard[1]);
  };

  //handle drag row event
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
          divA.style.backgroundColor = "#d6d3d3";
          divA.style.opacity = "0.5";
          divA.style.width =
            td.parentNode.getBoundingClientRect().width -
            coordinate.width +
            "px";
          divA.style.height = coordinate.height + "px";
          divA.style.left = coordinate.left + coordinate.width + "px";
          divA.style.top = coordinate.top + "px";

          document.onmouseup = finishDrag;
          document.onmousemove = function (e) {
            document.getElementsByTagName("body")[0].appendChild(divA);
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

  // handle drag column event
  useEffect(() => {
    Array.prototype.forEach.call(
      document.querySelectorAll("table th.thCellForMoving"),
      (th) => {
        let coordinate = th.getBoundingClientRect();
        let startIndex = undefined;
        th.addEventListener("mousedown", function () {
          startIndex = th.cellIndex;
          startDrag();
        });

        function startDrag() {
          let divA = document.createElement("div");
          divA.id = "A";
          divA.style.position = "absolute";
          divA.style.backgroundColor = "#d6d3d3";
          divA.style.opacity = "0.5";
          divA.style.left = coordinate.left + "px";
          divA.style.width = coordinate.width + "px";
          divA.style.height =
            document.getElementById("tbl").getBoundingClientRect().width -
            coordinate.height +
            "px";
          divA.style.top = coordinate.bottom + "px";

          document.onmouseup = finishDrag;
          document.onmousemove = function (e) {
            document.getElementsByTagName("body")[0].appendChild(divA);
            divA.style.left = divA.offsetLeft + e.movementX + "px";
          };
        }
        function finishDrag(e) {
          // remove divA after mouseup
          Array.prototype.forEach.call(
            document.querySelectorAll("#A"),
            (thisEl) => {
              thisEl.parentNode.removeChild(thisEl);
            }
          );
          let endEl = document.elementFromPoint(e.pageX, e.pageY);
          if (endEl.tagName === "INPUT") {
            endEl = endEl.parentNode;
            let endIndex = endEl.cellIndex;
            startIndex--;
            endIndex--;
            if (startIndex < endIndex) {
              //swap header
              let tempHeader = JSON.parse(JSON.stringify(theadData));
              let tempData = tempHeader[startIndex];
              tempHeader.splice(endIndex + 1, 0, tempData);
              tempHeader.splice(startIndex, 1);
              setTheadData(tempHeader);
              // swap tbody
              let tempArr = JSON.parse(JSON.stringify(initArray));
              tempArr.forEach((el) => {
                let data = el[startIndex];
                el.splice(endIndex + 1, 0, data);
                el.splice(startIndex, 1);
              });
              setInitArray(tempArr);
            }
            if (startIndex > endIndex) {
              //swap header
              let tempHeader = JSON.parse(JSON.stringify(theadData));
              let tempData = tempHeader[startIndex];
              tempHeader.splice(endIndex, 0, tempData);
              tempHeader.splice(startIndex + 1, 1);
              setTheadData(tempHeader);
              // swap tbody
              let tempArr = JSON.parse(JSON.stringify(initArray));
              tempArr.forEach((el) => {
                let data = el[startIndex];
                el.splice(endIndex, 0, data);
                el.splice(startIndex + 1, 1);
              });
              setInitArray(tempArr);
            }
          }
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }
    );
  }, []);

  // handle resize column width when component did mount
  // useEffect(() => {
  //   let colNum = initArray[0].length;
  //   let maxWidth = window.screen.width;
  //   let colWidth = (maxWidth - 33 - 20) / colNum;
  //   Array.prototype.forEach.call(
  //     document.querySelectorAll("table th"),
  //     function (th) {
  //       if (th.cellIndex !== 0) {
  //         th.style.width = colWidth + "px";
  //       }
  //     }
  //   );
  // }, []);

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
      </div>

      <div id="wrapper">
        <table id="tbl">
          <thead>
            <tr>
              <th className="disabledInput boundaryColor">
                <input disabled />
              </th>
              {theadData.map((th, index) => (
                <th
                  className="boundaryColor thCellForMoving"
                  key={index}
                  onClick={handleSelectColumn}
                >
                  <input
                    className="headerCell"
                    value={th}
                    onChange={handleChangeHeaderCell}
                  />
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
                      tabIndex={cindex}
                      className="cellData mycol"
                      key={cindex}
                      onClick={handleClickCell}
                      onDoubleClick={handleChangeCell}
                      onKeyPress={() => console.log(e)}
                    >
                      {columnData}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br></br>
      <button onClick={exportCSV}>Export CSV</button>
    </>
  );
};

export default Table;
