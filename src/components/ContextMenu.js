import React from "react";

const ContextMenu = (props) => {
  const { top, left, initArray, visible, setInitArray } = props;
  const menuStyle = {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    zIndex: "100",
  };
  const handleInsertRow = (event) => {
    event.preventDefault();
    const position = event.target.getAttribute("data-position");
    const thisTH = document.elementFromPoint(left - 5, top - 5);
    const indexOfRowAndArrayItem = thisTH.parentNode.parentNode.rowIndex;
    let tempArr = [...initArray];
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

  return (
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
  );
};

export default ContextMenu;
