import React, { useState, useEffect,useMemo } from 'react';
import { useTable, useFlexLayout,useGroupBy, useExpanded,useBlockLayout,useResizeColumns,useSortBy,usePagination, useFilters, useColumnOrder, useAsyncDebounce } from 'react-table'
import { useLocalStorage } from '../../Hooks'; 
import { Thead,Tbody,myFilter,useControlledState,scrollbarWidth,Buttons } from './';
import {HiChevronLeft as Left,HiChevronRight as Right,HiChevronDown as Down}  from "react-icons/hi"
import { HeaderEl } from '.';

export function Table(props) {
    const {columns, data,name,hasSubComp,subComp,isChangable,onChange,customColumns }=props
    const scrollBarSize =useMemo(() => scrollbarWidth(), [])
    const [heightRow, setHeightRow] =useLocalStorage(name+"_heightRow","35")
    const filterTypes = useMemo(() => ({ myFilter,}), [])
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        state,
        setState,
        allColumns,
        totalColumnsWidth,
        visibleColumns,
        setColumnOrder,
        setHiddenColumns,
        
    } = useTable(
        {
            columns,
            data,
            filterTypes,
            hasSubComp,
        },
        useColumnOrder,
        useFilters, 
        useGroupBy, 
        hooks => {
            hooks.useControlledState.push(useControlledState)
            hooks.visibleColumns.push((columns, { instance })=> {
                // console.log(customColumns);
            
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
                                </span> )
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
        // useFlexLayout,
        useSortBy,
        useExpanded,
        useResizeColumns ,
        useBlockLayout,
        usePagination,
    )
   


    const width=totalColumnsWidth+scrollBarSize
    const tbodyProps={ getTableBodyProps,rows,heightRow,width,prepareRow,isChangable,onChange}
    const theadProps={headerGroups,allColumns,setColumnOrder}
    const buttonsProps={heightRow,setHeightRow,name,columns,data,allColumns,setHiddenColumns}
// console.log(state);
    return (<div className="d-flex flex-column" >
        <div {...getTableProps()} className="table wrapper">
            <Thead {...theadProps}/>
            <Tbody {...tbodyProps}/>
        </div>
        <div className="center-sticky my-2">
            <Buttons {...buttonsProps}/>
        </div>
    </div>)
}


