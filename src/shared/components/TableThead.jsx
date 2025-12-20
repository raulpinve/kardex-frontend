import React from 'react';

const TableThead = ({children}) => {
    return (
        <thead className='border-gray-100 border-y bg-gray-50 dark:border-gray-800 dark:bg-gray-900 text-sm w-full text-left'>
            {children}
        </thead>
    );
};

export default TableThead;