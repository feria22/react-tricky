import React  from 'react'
import './style.scss';
import PropTypes from "prop-types";
import { PrepareData } from './TableParts/index';



function MyTable(props) {
  if (!props.table.length) return <>"Puste"</>
  else return <PrepareData {...props}/>

}

MyTable.defaultProps = {
  keyLabel:{},
  isGlobalFilter:false,
  filtredColArr:[],
  disableChangeArr:["id"],
  disableGrouppedArr:["id"],
  isFiltred:true,
  isChangable:false,
  hasSubComp:false,
  customColumns:[],
}
export default MyTable
