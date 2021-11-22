import React,{useEffect, useMemo,useState} from 'react'
import CsvDownloader from 'react-csv-downloader';
import { MyButton } from '../../Modules';
import MySelect from '../../SelectCheckBox/MySelect';


export function Buttons(props){
    const {heightRow,setHeightRow,data,name,columns,allColumns,setHiddenColumns}=props
    const tbody= useMemo(() => data.map(row=>Object.fromEntries(Object.entries(row).map((arr)=>([arr[0],arr[1]+"\t"])))), [data])
    const thead= useMemo(() => columns.map(x=>x.Header), [columns])
    const options= useMemo(() => allColumns.map(col=>({
        value:col.id,label:col.Header,
        checked:col.getToggleHiddenProps().checked,
    })), [allColumns])
    const [value, setValue] = useState()

    useEffect(()=>{
        const newArr=value?.map(x=>x.value)||[]
        setHiddenColumns(newArr)
    },[value])

return (
<div className="table-buttons">
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
    <MySelect
        options={options}
        menuPlacement="top"
        value={value}
        onChange={(arr)=>setValue(arr)}
    />
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
)
}