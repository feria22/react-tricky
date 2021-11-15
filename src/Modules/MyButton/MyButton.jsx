import React from 'react'
import PropTypes from "prop-types";

const MyButton=(props)=>{
    const {fun,className,addClassName,disabled}=props
    return <button type="button" 
        className={className +" "+addClassName} 
        onClick={()=>fun()}
        disabled={disabled}
        >
        {props.children}
        </button>
}
MyButton.propTypes = {
    fun: PropTypes.instanceOf(Function),
    className: PropTypes.string,
    addClassName:PropTypes.string,
    disabled:PropTypes.bool,
};

MyButton.defaultProps = {
    fun:()=>{console.log("Click ! No function")},
    className:"btn btn-outline-primary",
    addClassName:"",
    disabled:false,
};

export default MyButton