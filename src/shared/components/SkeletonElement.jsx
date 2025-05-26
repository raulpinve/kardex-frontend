import React from 'react';

const SkeletonElement = (props) => {
    const {className = ""} = props;

    return (
        <div className={`${className} animate-pulse bg-slate-200 dark:bg-slate-700 rounded`}></div> 
    );
};

export default SkeletonElement;