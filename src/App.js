import React, { useState, useEffect } from "react";
import "./App.css";

const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function App() {
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

  // useEffect(() => console.log(initArray), [initArray]);

  const handleClickCreate = (e) => {
    e.preventDefault();
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
    e.preventDefault();
    let thisTH = e.target;
    let thisTR = e.target.parentNode;
    let allTR = thisTH.parentNode.parentNode.childNodes;
    allTR.forEach((tr) => {
      tr.style.backgroundColor = null;
      tr.childNodes.forEach((th) => (th.style.backgroundColor = null));
    });
    if (thisTH.cellIndex === 0 && thisTR.rowIndex === 0) {
      thisTH.style.backgroundColor = "#e6efff";
    } else if (thisTH.cellIndex === 0 && thisTR.rowIndex !== 0) {
      thisTR.style.backgroundColor = "#e6efff";
    } else if (thisTH.cellIndex !== 0 && thisTR.rowIndex === 0) {
      let index = thisTH.cellIndex;
      allTR.forEach(
        (tr) => (tr.childNodes[index].style.backgroundColor = "#e6efff")
      );
    } else {
      thisTR.style.backgroundColor = "";
      thisTH.style.backgroundColor = "#e6efff";
      thisTH.contentEditable = "true";
    }
  };

  const handleChangeCell = (e) => {
    e.preventDefault();
    let tungdo = e.target.parentNode.rowIndex;
    let hoanhdo = e.target.cellIndex;

    let data = e.target.innerHTML;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard(tempArr1);
    tempArr[tungdo][hoanhdo] = data;
    setInitArray(tempArr);
  };

  const menuStyle = {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
  };

  const handleInsertColumn = (event) => {
    event.preventDefault();
    const position = event.target.getAttribute("data-position");
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfCellAndArrayItem = thisTH.cellIndex;
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
    const indexOfCellAndArrayItem = thisTH.cellIndex;
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
    const indexOfCellAndArrayItem = thisTH.cellIndex;
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
    const indexOfRowAndArrayItem = thisTH.parentNode.rowIndex;
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
    const indexOfRowAndArrayItem = thisTH.parentNode.rowIndex;
    let tempArr = [...initArray];
    let tempArr1 = JSON.parse(JSON.stringify(initArray));
    setClipBoard(tempArr1);
    tempArr.splice(indexOfRowAndArrayItem, 1);
    setInitArray(tempArr);
  };

  const handleDeleteRowContent = (event) => {
    event.preventDefault();
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfRowAndArrayItem = thisTH.parentNode.rowIndex;
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

  return (
    <div>
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
      <div id="table-data" className="scrollable">
        <table>
          <tbody id="tbody">
            {initArray &&
              initArray.map((i) => (
                <tr key={++keycount}>
                  {i.map((j) => (
                    <th key={++keycount + 100} onClick={handleClickCell}>
                      {j}
                    </th>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
