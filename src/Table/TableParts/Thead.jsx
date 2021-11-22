import React, { useState, useEffect } from 'react';
import {FaSortAmountDown as Desc,FaSortAmountUp as Asc,FaFolderMinus as UnGroup,FaFolderPlus as Group,FaEdit as Edit}  from "react-icons/fa"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


export function Thead(props){
const {headerGroups,allColumns,setColumnOrder}=props
const currentColOrder = React.useRef();
const getItemStyle = ({ isDragging, isDropAnimating }, draggableStyle) => ({
    userSelect: "none",
    ...(!isDragging && { transform: "translate(0,0)" }),
    ...(isDropAnimating && { transitionDuration: "0.001s" })
});

return( 
    <div className="thead">
        {headerGroups.map(headerGroup => (
            <DragDropContext key={headerGroup}
                onDragStart={() => currentColOrder.current = allColumns.map(o => o.id)}
                onDragUpdate={(dragUpdateObj, b) => {
                const colOrder = [...currentColOrder.current];
                const sIndex = dragUpdateObj.source.index;
                const dIndex =
                    dragUpdateObj.destination && dragUpdateObj.destination.index;
                if (typeof sIndex === "number" && typeof dIndex === "number") {
                    colOrder.splice(sIndex, 1);
                    colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                    setColumnOrder(colOrder);
                }
                }}
            >
            <Droppable droppableId="droppable" direction="horizontal">
                {(droppableProvided, snapshot) => (
                <div {...headerGroup.getHeaderGroupProps()}
                    ref={droppableProvided.innerRef}
                    className="tr"
                    
                >
                    {headerGroup.headers.map((column, index) => (
                    <Draggable  key={column.id}
                        draggableId={column.id}
                        index={index}
                        isDragDisabled={!column.accessor}
                    >
                        {(provided, snapshot) => {
                        // console.log({...column.getResizerProps()});
                        const headerProps=column.getHeaderProps()
                        return (
                            <div  {...headerProps} className="bold-border th "
                                style={{...getItemStyle( snapshot, provided.draggableProps.style),...headerProps.style}}
                            >
                                <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    className="cell"
                                >
                                    <HeaderEl column={column}/>
                                </div>
                                <div {...column.getResizerProps()}
                                className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                                /> 
                            </div>
                        );
                        }}
                    </Draggable>
                    ))}
                </div>
                )}
            </Droppable>
            </DragDropContext>
    ))}
    </div>
)
}

export function HeaderEl({column}){
    // if (column.render('Header')==="name") console.log(column);
    return( <>
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
        { column.disableChange ?    null:
            <span {...column.getGroupByToggleProps()} className="mr-3">
            <Edit/>
            </span>
        }
    </div>
    </>)
    
}

