
import React,{useState} from "react";
import MyTable from "./MyTable";
import { bigData, miniData } from "./testData";

const renderRowSubComponent = ( row ) => {
  // console.log(row);
  return <div >I am a subcomponent for row {row.index}</div>;
};
  
  const TestTable=()=>{
  
    return <div className="d-flex justify-content-center my-4">
      <MyTable table={bigData} name={"testNameTable"} 
      />
      </div>
  }
  export default TestTable;