import React from 'react';

const TableTbody = ({ children }) => {
    return (
        <tbody className='divide-y divide-gray-100  dark:divide-gray-800'>
            {children}
        </tbody>
    );
};

export default TableTbody;