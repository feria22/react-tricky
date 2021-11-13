import React from "react";
import PropTypes from "prop-types";
import  ReactSelect, { components } from "react-select";
import makeAnimated from "react-select/animated";
import "./style.scss"

const Option = props => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };
  
const MultiValueContainer  = props => {
      const isAll =!!props.selectProps.value.filter(x=>x.value===props.selectProps.allOption.value)?.length
      const current =props.data.value
      if (isAll&&current!==props.selectProps.allOption.value) return<></>
      else return(<components.MultiValueContainer  {...props}/> );
      }
  
const animatedComponents = makeAnimated();

export const allOption={value:"*",label:"Wybierz wszystko"}

function sorting(arr,isNumeric){
  if (isNumeric) return  arr.sort((a,b)=>(a.value).toString().localeCompare(b.value,undefined,{numeric: true}))
  else return arr.sort((a,b)=>(a.value).toString().localeCompare(b.value, 'pl', { sensitivity: 'base' }) )
}

const MySelect = props => {
  const {isSorted,options,isNumeric,allOption,onChange}=props

  const propsOpions=isSorted&&options?sorting(options,isNumeric):options;

  const optionsFix=[allOption, ...propsOpions]
   return   (<ReactSelect
        {...props}
        options={optionsFix}
        classNamePrefix="react-select"
        className="react-select__container"
        isMulti
        // menuIsOpen
        closeMenuOnSelect={false}
        noOptionsMessage={() => 'Brak opcji'}
        components={{ Option, MultiValueContainer ,  animatedComponents }}
        onChange={(selected, event) => {
                if (selected !== null && selected.length > 0) {
                  if (selected[selected.length - 1].value === allOption.value) {
                    return onChange(optionsFix);
                  }
                  let result = [];
                  if (selected.length === options.length) {
                    if (selected.includes(allOption)) {
                      result = selected.filter(
                        option => option.value !== allOption.value
                      );
                    } else if (event.action === "select-option") {
                      result = optionsFix;
                    }
                    return onChange(result);
                  }
                }
      
                return onChange(selected);
        }}
      />
    );
};

MySelect.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  isSorted:PropTypes.bool,
  isNumeric:PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  })
};

MySelect.defaultProps = {
  allOption,
  hideSelectedOptions:true,
  isSorted:true,
  isNumeric:false

};

export default MySelect;
