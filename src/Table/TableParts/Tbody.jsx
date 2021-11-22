
import React, { useState, useLayoutEffect,useRef } from 'react';
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList,VariableSizeList as List } from 'react-window'


export const Tbody=(props)=>{
    const {getTableBodyProps,rows,heightRow,width,prepareRow,isChangable,onChange}=props
    const outerListRef = useRef(undefined)
    const innerListRef = useRef(undefined)
    const [scrollOffset, setScrollOffset] = useState(0)
    const [listHeight, setListHeight] = useState(200)
    const [pageUp, pageDown, home, end] = [33, 34, 36, 35]
    const pageOffset = listHeight
    const maxHeight =
      (innerListRef.current &&innerListRef.current.style.height.replace('px', '')) ||
      listHeight
  
    const minHeight = 0.1
  
    const keys = {
      [pageUp]: Math.max(minHeight, scrollOffset - pageOffset),
      [pageDown]: Math.min(scrollOffset + pageOffset, maxHeight),
      [end]: maxHeight,
      [home]: minHeight,
    }
  
    const handleKeyDown = ({ keyCode }) => {
      keys[keyCode] && setScrollOffset(keys[keyCode])
    }
  
    useLayoutEffect(() => {
      outerListRef.current &&
        outerListRef.current.scrollTo({
          left: 0,
          top: scrollOffset,
          behavior: 'auto',
        })
    })
  
    return  (
    <div className="tbody" {...getTableBodyProps()}>
        {/* <AutoSizer >
        {({ height, width }) => (  */}
        <div onKeyDown={handleKeyDown} tabIndex="0" style={{ width: '151px' }}>
            <FixedSizeList
                outerRef={outerListRef}
                innerRef={innerListRef}
                height={200}
                itemCount={rows.length}
                itemSize={heightRow*1||35}
                width={width}
                useIsScrolling
                children={(p)=>RenderRow(p,rows,prepareRow,isChangable)}
            />
        </div>
    </div> )
}
const RenderRow =({ index,isScrolling,style },rows,prepareRow,isChangable,onChange) => {
    // if(isScrolling) return <span style={{textAlign:"start"}}>...</span>
    const row = rows[index]
    prepareRow(row)
    return (
    <div {...row.getRowProps({style,})}  className="tr" >
        {row.cells.map(cell => {
            console.log(cell);
        return (
            <div {...cell.getCellProps()} className="td">
            { isChangable&&!cell.column.disableChange? 
                <div onBlur={(e)=> onChange(row.original,cell.column.id,cell.value,e.target.innerText)} contentEditable suppressContentEditableWarning={true}>
                <p>{cell.render('Cell')}</p>
                </div>
                :
                // cell.isAggregated?cell.render('Cell').toString()+" szt":
                cell.render('Cell')}
            </div>
        )
        })}
    </div>
    )
}