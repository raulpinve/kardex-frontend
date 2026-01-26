import React from 'react';

const TableTd = ({ children, className = "", colSpan, onClick }) => {
    return (
        <td 
            className={`px-6 py-3 text-gray-700 dark:text-gray-400 break-all min-w-[150px]  ${className} ${colSpan ? "text-center": ""}`} 
            {...(colSpan ? { colSpan } : {})}
            onClick={onClick} 
        >
            {children}
        </td>
    );
};

export default TableTd;