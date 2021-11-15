import { throwStatement } from '@babel/types'
import React,{useState,useMemo} from 'react'
import { useTable, useFlexLayout,useGroupBy, useExpanded,useBlockLayout,useSortBy,usePagination, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { FixedSizeList,VariableSizeList as List } from 'react-window'
import {FaSortAmountDown as Desc,FaSortAmountUp as Asc,FaFolderMinus as UnGroup,FaFolderPlus as Group,FaEdit as Edit}  from "react-icons/fa"
import {HiChevronLeft as Left,HiChevronRight as Right,HiChevronDown as Down}  from "react-icons/hi"
// import {GrEdit as Edit}  from "react-icons/gr"

import CsvDownloader from 'react-csv-downloader';
import { MyButton } from '../Modules';
import './style.scss';
import { useLocalStorage } from '../Hooks'
import PropTypes from "prop-types";
import AutoSizer from "react-virtualized-auto-sizer";

function useControlledState(state, { instance }) {
  return useMemo(() => {
    if (state.groupBy.length) {
      return {
        ...state,
        hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
          (d, i, all) => all.indexOf(d) === i
        ),
      }
    }
    return state
  }, [state])
}

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Szukaj:{' '}
      <input
        value={value || ""}
        className="form-control color-unset" 
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </span>
  )
}
function MyFilterRender (props){
  const [state, setstate] = useState(true)
  const {isFilter4Groupped,groupedRows,preFilteredRows}=props
console.log(isFilter4Groupped,groupedRows,preFilteredRows);

  // const arr4filter=React.useMemo(()=>{
  //   if(isFilter4Groupped&&groupedRows.length!=preFilteredRows.length) {
  //     const array={}
  //     groupedRows.forEach(row=>{
  //       const countOfRows=row.leafRows?.length
  //       array[countOfRows]?null:array[countOfRows]=[]
  //       return row.leafRows?.forEach(x=>{array[countOfRows].push(x.original.id*1); return true})
  //     })
  //     return array
  //   }

  //   return preFilteredRows.map(x=>x.original)
  // },[isFilter4Groupped,groupedRows,preFilteredRows])
  
  // console.log(arr4filter);

  return (<>filter</>)
}


function HeaderEl({column}){
  // if (column.render('Header')==="name") console.log(column);
  return <>
    <div {...column.getSortByToggleProps()} className=" d-flex justify-content-between" >
      {column.render('Header')}
      <span > {column.isSorted? column.isSortedDesc? <Desc/>: <Asc/>: null}  </span>
    </div>  
    <div className="d-flex justify-content-between">
      {column.canFilter ? column.render('Filter'): null}
      { column.canGroupBy ?
      <span {...column.getGroupByToggleProps()} className="mr-3">
      {column.isGrouped ?<UnGroup/>:<Group/> }
      </span>
    :null}
     { column.disableChange ?null:
      <span {...column.getGroupByToggleProps()} className="mr-3">
         <Edit/>
      </span>
    }
    </div>
  </>
  
}



          
function Table(props) {
    const {columns, data,name,isGlobalFilter,hasSubComp,subComp,isChangable,onChange,customColumns }=props
    const scrollBarSize =useMemo(() => scrollbarWidth(), [])
    const [heightRow, setHeightRow] =useLocalStorage(name+"_heightRow","35")
    const [isFilter4Groupped, setiIsFilter4Groupped] = useState(true)
    // const listRef = React.useRef(null);
    // const onExpand = React.useCallback(row => {
    //   row.toggleRowExpanded();
    //   listRef.current && listRef.current.resetAfterIndex(0);
    //   // rebuildTooltip();
    // }, []);
  
    // const onSort = React.useCallback(column => {
    //   listRef.current && listRef.current.resetAfterIndex(0);
    //   column.toggleSortBy();
    // }, []);


    const filterTypes = React.useMemo(
      () => ({
        myFilter: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values[id]
            return rowValue !== undefined
              ? String(rowValue)
                  .toLowerCase()
                  .startsWith(String(filterValue).toLowerCase())
              : true
          })
        },
      }), [])
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        state,
        setState,
        //dla Virtualized Rows (React-Window)
        totalColumnsWidth,
        //dla filtra
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
      } = useTable(
        {
          columns,
          data,
          filterTypes,
          isFilter4Groupped,
          hasSubComp,
          initialState:{}
        },
        useFilters, 
        useGlobalFilter,
        useGroupBy, 
        hooks => {
          hooks.useControlledState.push(useControlledState)
          hooks.visibleColumns.push((columns, { instance }) => {
            console.log(customColumns);

            // if(customColumns.length&&!instance.state.groupBy.length){
            //   return [
            //     ...customColumns,
            //     ,...columns
            //   ]
            // }

            
            if (instance.hasSubComp){
              return [
              {
                Header: () => null, // No header
                width:30,
                disableChange:true,
                id: 'expander', // It needs an ID
                 Cell: ({ row }) => (
                  <span {...row.getToggleRowExpandedProps()} >
                    {row.isExpanded ? <Down/> : <Right/>}
                  </span>
                )
              },...columns,
            ]
          }
          else if (!instance.state.groupBy.length) {
            return columns
          }
            const newWidth=instance.state.groupBy.reduce((acc,val)=>acc+val.length,0)*25+50
            return [
              {
                id: 'expanderGroupped', // Make sure it has an ID
                width:newWidth,
                disableChange:true,
                Header: ({ allColumns, state: { groupBy } }) => {
                  const arrLen=groupBy.length
                  return groupBy.map((columnId,i) => {
                    const column = allColumns.find(d => d.id === columnId)
                    const width=column.width>100?100:column.width
                    return (<div className="d-flex  align-items-center justify-content-between" style={{width}} key={columnId}>
                        <span style={{width:width-20}}>
                          <HeaderEl column={column}/>
                        </span>
                        {i<arrLen-1?<Right/>:null}
                      </div>
                    )
                  })
                },
                Cell: (props) => {
                  // console.log(props);
                  const{row}=props
                  if (row.canExpand) {
                    const groupedCell = row.allCells.find(d => d.isGrouped)
    
                    return (
                      <span
                        {...row.getToggleRowExpandedProps({
                          style: {
                            // We can even use the row.depth property
                            // and paddingLeft to indicate the depth
                            // of the row
                            paddingLeft: `${row.depth * 2}rem`,
                          },
                        })}
                      >
                        {row.isExpanded ? <Down/> : <Right/>} {groupedCell.render('Cell')}{' '}
                        ({row.subRows.length} szt)
                      </span>
                    )
                  }
    
                  return null
                },
              },
              ...columns,
            ]
          })
        },
        useFlexLayout,
        useSortBy,
        useExpanded,
        useBlockLayout,
        usePagination,
     
      )


    // const RenderRow = React.useCallback(
    //   ({ index, style }) => {
    //     const row = rows[index]
    //     prepareRow(row)
    //     return (
    //     <div {...row.getRowProps({style})}  className="tr-group">
    //       <div  className="tr" >
    //         {row.cells.map(cell => {
    //           return (
    //             <div {...cell.getCellProps()} className="td">
    //               {cell.isAggregated? 
    //                 cell.render('Aggregated'): cell.isPlaceholder? null 
    //                     : cell.render('Cell')}
    //             </div>
    //           )
    //         })}
    //       </div>
    //       {/* {row.isExpanded ?  <div className="tr" style={{background:"red"}}>{subComp(row)}</div> : null}  */}

    //       </div>)}
    // ,[prepareRow, rows]
    // )

    const RenderRow = React.useCallback(
      ({ index, style }) => {
        const row = rows[index]
        prepareRow(row)
        // console.log(row);
        return (
          <div
            {...row.getRowProps({
              style,
            })}
            className="tr"
          >
            {row.cells.map(cell => {
              // console.log(cell);
              return (
                <div {...cell.getCellProps()} className="td">
 

                { isChangable&&!cell.column.disableChange? 
                <div onBlur={(e)=> onChange(row.original,cell.column.id,cell.value,e.target.innerText)} contentEditable suppressContentEditableWarning={true}>
                <p>{cell.render('Cell')}</p>
                </div>
                :cell.render('Cell')}
                </div>
              )
            })}
          </div>
        )
      },
      [prepareRow, rows]
    )
      return (<>
        <div {...getTableProps()} className="table">
          <div className="thead">
            {headerGroups.map(headerGroup => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr ">
                {headerGroup.headers.map(column => (
                  <div {...column.getHeaderProps()} className="bold-border th ">
                    <HeaderEl column={column}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
    
           {/* <div {...getTableBodyProps()}>
        
            <  
              height={200}
              itemCount={rows.length}
              itemSize={heightRow}
              // itemSize={i => (rows[i] && rows[i].isExpanded ? 300 :heightRow*1||35)}
              width={3000}
            >
              {RenderRow}
            </>
          </div>  */}

          <div className="tbody" {...getTableBodyProps()}>
             {/* <AutoSizer >
              {({ height, width }) => (  */}
                <FixedSizeList
                  height={200}
                  itemCount={rows.length}
                   itemSize={heightRow*1||35}
                  // itemSize={i => (rows[i] && rows[i].isExpanded ? 300 : heightRow*1||35)}
                  width={totalColumnsWidth+scrollBarSize}
                >
           
                  {RenderRow}
                </FixedSizeList>

          </div> 
        </div>
        <div className="center-sticky my-2">
          <Buttons
          heightRow={heightRow}
          setHeightRow={setHeightRow}
          name={name}
          columns={columns}
          data={data}
          isFilter4Groupped={isFilter4Groupped}
          setiIsFilter4Groupped={()=>setiIsFilter4Groupped(!isFilter4Groupped)}
          />

        </div>
        </>
      )
}

function Buttons(props){
  const {heightRow,setHeightRow,data,name,columns,isFilter4Groupped,setiIsFilter4Groupped}=props
  const tbody= useMemo(() => data.map(row=>Object.fromEntries(Object.entries(row).map((arr)=>([arr[0],arr[1]+"\t"])))), [data])
  const thead= useMemo(() => columns.map(x=>x.Header), [columns])

  return <div className="table-buttons">
    <div>
      <div className="input-group color-unset" >
        <input type="number" className="form-control color-unset" 
        placeholder="Wysokość wiersza" 
        style={{maxWidth:75}}
        value={heightRow } 
        onChange={(e)=>{const val=e.target.value*1||25;setHeightRow(val)}}
        />
      <span className="input-group-text color-unset" >Wysokość wiersza w px</span>
    </div>
  </div>

  <div className="form-check form-switch color-unset">
    <input className="form-check-input color-unset" type="checkbox"  checked={isFilter4Groupped} onChange={()=>setiIsFilter4Groupped()}/>
    <label className="form-check-label color-unset" >Filtrowanie pogrupowanego</label>
  </div>
  <div>
    <MyButton disabled={!data?.length} addClassName={"color-unset"}> 
    <CsvDownloader
          filename={name}
          extension=".csv"
          separator=";"
          columns={thead}
          datas={tbody}
          >Wyeksportuj</CsvDownloader>
    </MyButton>
  </div>

</div>
}


function doObj(key,keyLabel){
  // console.log("doObj",key,"disableChange",keyLabel.disableChange,"hasSubComp",keyLabel.hasSubComp);
    return  {
        Header: keyLabel.label,
        accessor: key,
        width:keyLabel.width,
        disableFilters:!keyLabel.isFiltred,
        disableGroupBy:keyLabel.disableGroupBy,
        disableChange:keyLabel.disableChange,
        filter: 'myFilter',
        Filter: MyFilterRender,
        aggregate: 'count',
        Aggregated: ({ value }) => `${value} szt`,
        }
    
}

const scrollbarWidth = () => {
    const scrollDiv = document.createElement('div')
    scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;')
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
}

function MyTable(props) {
  if (!props.table.length) return <>"Puste"</>
  else return <NotEmptyTab {...props}/>

}
// MyTable.propTypes = {
//   keyLabel: PropTypes.object,
//   filtredColArr: PropTypes.object,
//   isGlobalFilter: PropTypes.bool,
//   isFiltred:PropTypes.bool,
//   hasSubComp:PropTypes.bool
// };

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

const NotEmptyTab=(props)=>{
  
  const{table,keyLabel,name,isGlobalFilter,filtredColArr,disableGrouppedArr,isFiltred,hasSubComp,subComp,disableChangeArr,isChangable} =props
  
  const keys =useMemo(() =>Object.keys(table[0]), [table])
  
  const keyLabelWithWidth =useMemo(() =>{
    const miniTab=  table.slice(-100);
    const resp=keys.map(key=>{
      // const avgLength=miniTab.reduce((acc,val)=>acc+val[key].toString().length,0)/miniTab.length
      const maxLength=miniTab.reduce((acc,val)=>acc<val[key].toString().length?val[key].toString().length:acc,0)
      const avgWidth=Math.ceil(maxLength*10+30);
      const label=keyLabel[key]||key;
      const labelWidth=Math.ceil(label.length*10+50);
      const whichWidth=avgWidth>labelWidth?avgWidth:labelWidth
      // console.log("keyLabelWithWidth",key,disableChangeArr[key],disableChangeArr);
      const isChLen=!!disableChangeArr?.filter(x=>x.toLowerCase()==key.toLowerCase())?.length
      const isFLen=!!filtredColArr?.filter(x=>x.toLowerCase()==key.toLowerCase())?.length
      const isGLen=!!disableGrouppedArr?.filter(x=>x.toLowerCase()==key.toLowerCase())?.length
      const disableChange=isChangable?isChLen?isChLen:false:true
      // keyLabel.disableChange?keyLabel.hasSubComp:true,
      // if (key=="name"||key=="id") console.log(key,isChangable,disableChangeArr,isChLen);
      return ([[key],{
        label,
        width:whichWidth<500?whichWidth:500,
        isFiltred:isFLen?isFLen:isFiltred,
        disableGroupBy:disableChange?hasSubComp?true:isGLen?isGLen:false:true,
        hasSubComp,
        disableChange,
      }])
    })
    return Object.fromEntries(resp)
    }, [table])

    const columns =useMemo(() =>table?.length?keys.map(key=>doObj(key,keyLabelWithWidth[key])):[], [table])
    // console.log(columns);
    return  <div className="wrapper">
      <Table 
        {...props}
        columns={columns} 
        data={table} 
        name={name}
      />
      </div> 
}
export default MyTable
