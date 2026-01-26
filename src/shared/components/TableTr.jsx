import React from 'react';

const TableTr = ({children, onClick, className}) => {
    return (
        <tr onClick={onClick} className={className}>
            {children}
        </tr>
    );
};

export default TableTr;