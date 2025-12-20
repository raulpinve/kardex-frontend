import React from 'react';

const TableTh = ({ children, colSpan, className = ""}) => {
    return (
        <th 
            className={`px-6 py-3 text-gray-700 dark:text-gray-400 ${className}`} 
            {...(colSpan ? { colSpan } : {})}
        >
            {children}
        </th>
    );
};

export default TableTh;