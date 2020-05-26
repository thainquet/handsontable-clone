import React, { useState, useEffect } from "react";
import "./Table.css";
// import $ from "jquery";
// window.$ = $;

const makeid = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}; // for making dummy data

function Table() {
  const [rowNum, setRowNum] = useState(6);
  const [colNum, setColNum] = useState(7);
  const [initArray, setInitArray] = useState(
    // [...Array(rowNum)].map((x) => Array(colNum).fill(""))
    [
      ["a", "b", "c", "d", "e", "f", "G"],
      ["q1", "b", "c", "d", "e", "f", "G"],
      ["q2", "b", "c", "d", "e", "f", "G"],
      ["q3", "b", "c", "d", "e", "f", "G"],
      ["a", "b", "c", "d", "e", "f", "G"],
    ]
  );
  const [clipBoard, setClipBoard] = useState([]);
  // For context menu
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  let count = -1; // index for first row and column
  let keycount = 0; // key in loop render

  // useEffect(() => {
  //   var table = $("#tbl");

  //   var isMouseDown = false;
  //   var startRowIndex = null;
  //   var startCellIndex = null;

  //   function selectTo(cell) {
  //     var row = cell.parent();
  //     var cellIndex = cell.index();
  //     var rowIndex = row.index();

  //     var rowStart, rowEnd, cellStart, cellEnd;

  //     if (rowIndex < startRowIndex) {
  //       rowStart = rowIndex;
  //       rowEnd = startRowIndex;
  //     } else {
  //       rowStart = startRowIndex;
  //       rowEnd = rowIndex;
  //     }

  //     if (cellIndex < startCellIndex) {
  //       cellStart = cellIndex;
  //       cellEnd = startCellIndex;
  //     } else {
  //       cellStart = startCellIndex;
  //       cellEnd = cellIndex;
  //     }

  //     for (var i = rowStart; i <= rowEnd; i++) {
  //       var rowCells = table.find("tr").eq(i).find("th");
  //       for (var j = cellStart; j <= cellEnd; j++) {
  //         rowCells.eq(j).addClass("selected");
  //       }
  //     }
  //   }

  //   table
  //     .find("th")
  //     .mousedown(function (e) {
  //       isMouseDown = true;
  //       var cell = $(this);

  //       table.find(".selected").removeClass("selected"); // deselect everything

  //       if (e.shiftKey) {
  //         selectTo(cell);
  //       } else {
  //         cell.addClass("selected");
  //         startCellIndex = cell.index();
  //         startRowIndex = cell.parent().index();
  //       }

  //       return false; // prevent text selection
  //     })
  //     .mouseover(function () {
  //       if (!isMouseDown) return;
  //       table.find(".selected").removeClass("selected");
  //       selectTo($(this));
  //     })
  //     .bind("selectstart", function () {
  //       return false;
  //     });

  //   $(document).mouseup(function () {
  //     isMouseDown = false;
  //   });
  // });

  useEffect(() => {
    let arr = JSON.parse(JSON.stringify(initArray)); // deep clone
    let lengthItem = initArray[0].length;
    // console.log(arr);
    arr.splice(0, 0, Array(lengthItem).fill("")); // add new row at top of array
    arr.map((el) => el.splice(0, 0, "")); // add new column at left of array
    // console.log(arr);
    arr.forEach((i) => {
      i[0] = arr.indexOf(i);
    });
    for (let i = 0; i < arr[0].length; i++) {
      arr[0][i] = ++count;
    }
    arr[0][0] = "";
    setInitArray(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      .getElementById("table-data")
      .addEventListener("contextmenu", handleRightClick);
    return () =>
      document
        .getElementById("table-data")
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
            let tungdo = e.target.parentNode.parentNode.rowIndex;
            let hoanhdo = e.target.parentNode.cellIndex;
            let tempArr = JSON.parse(JSON.stringify(initArray));
            setClipBoard(initArray);
            tempArr[tungdo][hoanhdo] = data;
            setInitArray(tempArr);
          })
          .catch((err) => {
            console.error("Failed to read clipboard contents: ", err);
          });
      }
    };
    document
      .getElementById("table-data")
      .addEventListener("keydown", handleCopyPaste, false);
    return () =>
      document
        .getElementById("table-data")
        .removeEventListener("keydown", handleCopyPaste, false);
  });

  // useEffect(() => console.log(initArray), [initArray]);

  const handleClickCreate = (e) => {
    let arr = [...Array(rowNum)].map((x) => Array(colNum).fill(makeid(5)));
    arr.forEach((i) => {
      i[0] = arr.indexOf(i);
    });
    for (let i = 0; i < arr[0].length; i++) {
      arr[0][i] = ++count;
    }
    setInitArray(arr);
  };

  const clearBackgroundColor = (TR) => {
    TR.childNodes.forEach((th) => {
      th.childNodes.forEach((input) => {
        input.style.backgroundColor = "";
        input.style.border = "";
      });
      th.style.backgroundColor = "";
      th.style.border = "";
    });
    TR.style.border = "";
  };

  const handleClickCell = (e) => {
    e.preventDefault();
    if (e.target.tagName === "TH") return;
    let thisInput = e.target;
    let thisTH = thisInput.parentNode;
    let thisTR = thisTH.parentNode;
    let allTR = thisTH.parentNode.parentNode.childNodes;
    allTR.forEach((TR) => clearBackgroundColor(TR));
    if (thisTH.cellIndex === 0 && thisTR.rowIndex === 0) {
      thisInput.style.backgroundColor = "#e6efff";
    } else if (thisTH.cellIndex === 0 && thisTR.rowIndex !== 0) {
      allTR.forEach((TR) => clearBackgroundColor(TR));
      thisTR.style.border = "2px solid #4b89ff";
      thisTR.style.backgroundColor = "#e6efff";
      thisTR.childNodes.forEach((th) => {
        th.childNodes[0].style.backgroundColor = "#e6efff";
        th.style.backgroundColor = "#e6efff";
      });
      thisTR.childNodes[0].style.backgroundColor = "#8eb0e7";
      thisTR.childNodes[0].childNodes[0].style.backgroundColor = "#8eb0e7";
    } else if (thisTH.cellIndex !== 0 && thisTR.rowIndex === 0) {
      let index = thisTH.cellIndex;
      allTR.forEach((tr, i) => {
        if (i === 0) {
          clearBackgroundColor(tr);
          tr.childNodes[index].childNodes[0].style.backgroundColor = "#8eb0e7";
          tr.childNodes[index].style.backgroundColor = "#8eb0e7";
          tr.childNodes[index].style.borderTop = "2px solid #4b89ff";
          tr.childNodes[index].style.borderLeft = "2px solid #4b89ff";
          tr.childNodes[index].style.borderRight = "2px solid #4b89ff";
        }
        if (i !== 0 && i < allTR.length - 1) {
          clearBackgroundColor(tr);
          tr.childNodes[index].childNodes[0].style.backgroundColor = "#e6efff";
          tr.childNodes[index].style.backgroundColor = "#e6efff";
          tr.childNodes[index].style.borderRight = "2px solid #4b89ff";
          tr.childNodes[index].style.borderLeft = "2px solid #4b89ff";
        }
        if (i === allTR.length - 1) {
          clearBackgroundColor(tr);
          tr.childNodes[index].childNodes[0].style.backgroundColor = "#e6efff";
          tr.childNodes[index].style.backgroundColor = "#e6efff";
          tr.childNodes[index].style.borderBottom = "2px solid #4b89ff";
          tr.childNodes[index].style.borderLeft = "2px solid #4b89ff";
          tr.childNodes[index].style.borderRight = "2px solid #4b89ff";
        }
      });
    } else {
      allTR.forEach((TR) => clearBackgroundColor(TR));
      thisTR.style.backgroundColor = "";
      thisTR.childNodes.forEach(
        (th) => (th.childNodes[0].style.backgroundColor = "")
      );
      thisTH.style.backgroundColor = "#e6efff";
      thisInput.style.backgroundColor = "#e6efff";
      thisTH.style.border = "2px solid transparent";
      thisTH.style.border = "2px solid #4b89ff";

      let corner = document.createElement("DIV");
      corner.innerHTML = "";
      corner.style.border = "1px solid white";
      corner.style.position = "absolute";
      corner.style.backgroundColor = "#4b89ff";
      corner.style.bottom = "-5px";
      corner.style.right = "-5px";
      corner.style.height = "6px";
      corner.style.width = "6px";
      corner.style.zIndex = "99";
      corner.style.cursor = "crosshair";
      // let initRight = 0;
      // let initBottom = 0;
      function mouseMove(e) {
        e.stopPropagation();
        let thisElement = document.elementFromPoint(e.pageX, e.pageY);
        if (thisElement.tagName === "INPUT") {
        }
      }
      thisInput.addEventListener("mousedown", function (e) {
        console.log(e.target.parentNode);
        thisTR.addEventListener("mousemove", mouseMove);
      });

      thisTR.addEventListener("mouseup", function (e) {
        if (e.target.tagName === "INPUT") {
          let lastEl = e.target.parentNode;
          console.log(lastEl);
        }
        thisTR.removeEventListener("mousemove", mouseMove);
      });

      thisTH.appendChild(corner);

      let cellIndex = thisTH.cellIndex;
      let rowIndex = thisTR.rowIndex;
      allTR[0].childNodes[cellIndex].childNodes[0].style.backgroundColor =
        "#dcdcdc";
      allTR[rowIndex].childNodes[0].childNodes[0].style.backgroundColor =
        "#dcdcdc";
      allTR[0].childNodes[cellIndex].style.backgroundColor = "#dcdcdc";
      allTR[rowIndex].childNodes[0].style.backgroundColor = "#dcdcdc";
    }
  };

  const handleChangeCell = (e) => {
    e.preventDefault();
    let tungdo = e.target.parentNode.parentNode.rowIndex;
    let hoanhdo = e.target.parentNode.cellIndex;

    let data = e.target.value;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    // console.log(tempArr1);
    setClipBoard(tempArr1);
    tempArr[tungdo][hoanhdo] = data;
    setInitArray(tempArr);
  };

  const menuStyle = {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    zIndex: "100",
  };

  const handleInsertColumn = (event) => {
    event.preventDefault();
    const position = event.target.getAttribute("data-position");
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfCellAndArrayItem = thisTH.parentNode.cellIndex;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard(tempArr1);
    if (position === "right") {
      tempArr.forEach((el) => {
        el.splice(indexOfCellAndArrayItem + 1, 0, "");
      });
    }
    if (position === "left") {
      tempArr.forEach((el) => {
        el.splice(indexOfCellAndArrayItem, 0, "");
      });
    }
    setInitArray(tempArr);
  };

  const handleDeleteColumn = (event) => {
    event.preventDefault();
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfCellAndArrayItem = thisTH.parentNode.cellIndex;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard(tempArr1);
    tempArr.forEach((el) => {
      el.splice(indexOfCellAndArrayItem, 1);
    });
    setInitArray(tempArr);
  };

  const handleDeleteColumnContent = (event) => {
    event.preventDefault();
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfCellAndArrayItem = thisTH.parentNode.cellIndex;
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard(tempArr1);
    let tempArr = [...initArray];
    tempArr.forEach((el, index) => {
      if (index !== 0) {
        el[indexOfCellAndArrayItem] = "";
      }
    });
    setInitArray(tempArr);
  };

  const handleInsertRow = (event) => {
    event.preventDefault();
    const position = event.target.getAttribute("data-position");
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfRowAndArrayItem = thisTH.parentNode.parentNode.rowIndex;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard(tempArr1);
    const lengthItem = tempArr[0].length;
    const Item = new Array(lengthItem).fill("");
    if (position === "below") {
      tempArr.splice(indexOfRowAndArrayItem + 1, 0, Item);
    }
    if (position === "above") {
      tempArr.splice(indexOfRowAndArrayItem, 0, Item);
    }
    setInitArray(tempArr);
  };

  const handleDeleteRow = (event) => {
    event.preventDefault();
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfRowAndArrayItem = thisTH.parentNode.parentNode.rowIndex;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard(tempArr1);
    tempArr.splice(indexOfRowAndArrayItem, 1);
    setInitArray(tempArr);
  };

  const handleDeleteRowContent = (event) => {
    event.preventDefault();
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfRowAndArrayItem = thisTH.parentNode.parentNode.rowIndex;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard(tempArr1);
    tempArr[indexOfRowAndArrayItem] = tempArr[
      indexOfRowAndArrayItem
    ].map((el, index) => (index !== 0 ? (el = "") : el));
    setInitArray(tempArr);
  };

  const handleUndo = (e) => {
    e.preventDefault();
    console.log(clipBoard);
    setInitArray(clipBoard);
  };

  const exportCSV = () => {
    let arr = JSON.parse(JSON.stringify(initArray));
    arr.splice(0, 1);
    arr.map((x) => x.splice(0, 1));
    let csvContent =
      "data:text/csv;charset=utf-8," + arr.map((e) => e.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    let thElm;
    let startOffset;

    Array.prototype.forEach.call(
      document.querySelectorAll("table th"),
      function (th) {
        th.style.position = "relative";

        let grip = document.createElement("div");
        grip.innerHTML = "&nbsp;";
        grip.style.top = 0;
        grip.style.right = 0;
        grip.style.bottom = 0;
        grip.style.width = "1px";
        grip.style.position = "absolute";
        grip.style.cursor = "col-resize";
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

  useEffect(() => {
    let thElm;
    let startOffset;

    Array.prototype.forEach.call(
      document.querySelectorAll("table th"),
      function (th) {
        th.style.position = "relative";

        let grip = document.createElement("div");
        grip.innerHTML = "&nbsp;";
        grip.style.bottom = 0;
        grip.style.left = 0;
        grip.style.right = 0;
        grip.style.height = "1px";
        grip.style.position = "absolute";
        grip.style.cursor = "row-resize";
        grip.addEventListener("mousedown", function (e) {
          thElm = th;
          startOffset = th.offsetHeight - e.pageY;
        });

        th.appendChild(grip);
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
  });

  return (
    <div style={{ position: "relative" }}>
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
        <div className="menu-line" onClick={handleDeleteColumn}>
          Delete this column
        </div>
        <div
          className="menu-line borderBottom"
          onClick={handleDeleteColumnContent}
        >
          Delete this column content
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
        <div className="menu-line" onClick={handleDeleteRow}>
          Delete this row
        </div>
        <div className="menu-line" onClick={handleDeleteRowContent}>
          Delete this row content
        </div>
      </div>

      <input
        placeholder="row"
        onChange={(e) => setRowNum(parseInt(e.target.value) + 1)}
      />
      <input
        placeholder="column"
        onChange={(e) => setColNum(parseInt(e.target.value) + 1)}
      />
      <button onClick={() => handleClickCreate()} onChange={handleChangeCell}>
        Create
      </button>
      <br />
      <br />
      <div id="table-data" className="scrollable">
        <table id="tbl">
          <tbody id="tbody">
            {initArray &&
              initArray.map((i, rowIndex) =>
                rowIndex === 0 ? (
                  <tr key={rowIndex}>
                    {i.map((j, columnIndex) =>
                      columnIndex === 0 ? (
                        <th
                          className="boundaryColor firstColumn"
                          style={{ position: "relative" }}
                          key={++keycount + 100}
                        >
                          <input
                            className="centered boundaryColor"
                            onClick={handleClickCell}
                            onChange={handleChangeCell}
                            value={j}
                          />
                        </th>
                      ) : (
                          <th
                            className="centered boundaryColor"
                            style={{ position: "relative" }}
                            key={++keycount + 100}
                          >
                            <input
                              className="centered boundaryColor"
                              onClick={handleClickCell}
                              onChange={handleChangeCell}
                              value={j}
                            />
                          </th>
                        )
                    )}
                  </tr>
                ) : (
                    <tr key={++keycount}>
                      {i.map((j, columnIndex) =>
                        columnIndex !== 0 ? (
                          <th
                            style={{ position: "relative" }}
                            key={++keycount + 100}
                            onClick={handleClickCell}
                          >
                            <input
                              onClick={handleClickCell}
                              onChange={handleChangeCell}
                              value={j}
                            />
                          </th>
                        ) : (
                            <th
                              className="boundaryColor firstColumn"
                              style={{ position: "relative" }}
                              key={++keycount + 100}
                              onClick={handleClickCell}
                            >
                              <input
                                className="centered boundaryColor"
                                disabled
                                value={j}
                              />
                            </th>
                          )
                      )}
                    </tr>
                  )
              )}
          </tbody>
        </table>
      </div>
      <br />
      <button onClick={exportCSV}>Export CSV</button>
    </div>
  );
}

export default Table;
