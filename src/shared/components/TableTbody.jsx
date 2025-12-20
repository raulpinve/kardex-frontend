import React from 'react';

const TableTbody = ({ children }) => {
    return (
        <tbody className='divide-y divide-gray-100  text-sm dark:divide-gray-800'>
            {children}
        </tbody>
    );
};

export default TableTbody;