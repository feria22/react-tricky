import React, { useState, useEffect,useMemo } from 'react';
import { Table,MyFilterRender } from '.';


export const PrepareData=(props)=>{
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
    return <Table 
        {...props}
        columns={columns} 
        data={table} 
        name={name}
    />
 
}

function doObj(key,keyLabel){
// console.log("doObj",key,"disableChange",keyLabel.disableChange,"hasSubComp",keyLabel.hasSubComp);
    return  {
        Header: keyLabel.label,
        accessor: key,
        disableFilters:!keyLabel.isFiltred,
        disableGroupBy:keyLabel.disableGroupBy,
        disableChange:keyLabel.disableChange,
        width:keyLabel.width,
        minWidth: 30,
        maxWidth: 600,
        filter: 'myFilter',
        Filter: MyFilterRender,
        aggregate: 'count',
        Aggregated: ({ value }) => `${value} szt`,
        }
    
}