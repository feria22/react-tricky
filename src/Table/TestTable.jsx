
import React,{useState} from "react";
import MyTable from "./ReactTable";
import { bigData, miniData } from "./testData";

const renderRowSubComponent = ( row ) => {
  // console.log(row);
  return <div >I am a subcomponent for row {row.index}</div>;
};
  
  const TestTable=()=>{
  
    return <div className="d-flex justify-content-center my-4">
      <MyTable table={bigData} name={"testNameTable"} 
      // isChangable={true}   onChange={(row,columnName,oldValue,newValue)=>console.log(row,columnName,oldValue,newValue)}
      // subComp={(row)=>renderRowSubComponent(row)} hasSubComp={true}
      // customColumns={[
      //   {id: 'customColumn', // Make sure it has an ID
      //   width:50,
      //   disableChange:true,
      //   Header: ()=>null,
      //   Cell: (props) => {
      //     // console.log(props);
      //     const{row}=props
      //       return (
      //         <span onClick={()=>console.log(row)}>
      //          test
      //         </span>
      //       )
      //     },
      //   },
      // ]}
      />
      </div>
  }
  export default TestTable;