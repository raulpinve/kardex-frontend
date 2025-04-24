import React from 'react';

const SkeletonElement = (props) => {
    const {className = ""} = props;

    return (
        <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[25px] ${className}`}></div> 
    );
};

export default SkeletonElement;