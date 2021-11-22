import React,{useState} from 'react'

export function myFilter(rows, id, filterValue) {
    return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue !== undefined
        ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
        : true
    })
}
export function MyFilterRender (props){
    const [state, setstate] = useState(true)
    const {isFilter4Groupped,groupedRows,preFilteredRows}=props
    // console.log( "MyFilterRender" isFilter4Groupped,groupedRows,preFilteredRows);

    return (<>filter</>)
}