import React from 'react';

const TableTd = ({ children, className = "", colSpan, onClick }) => {
    return (
        <td 
            className={`px-6 py-3 text-gray-700 dark:text-gray-400 ${className} ${colSpan ? "text-center": ""}`} 
            {...(colSpan ? { colSpan } : {})}
            onClick={onClick} 
        >
            {children}
        </td>
    );
};

export default TableTd;