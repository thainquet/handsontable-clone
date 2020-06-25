import React from "react";
import "./App.css";
import Table from "./components/TestTable";
// import Table from "./components/Table";

import data from "./dummyData";

function App() {
  return (
    <div>
      <Table tableData={data} />
    </div>
  );
}

export default App;
