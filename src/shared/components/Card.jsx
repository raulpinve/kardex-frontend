import React from 'react';

const Card = ({children}) => {
    return (
        <div className='mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]'>
            {children}
        </div>
    );
};

export default Card;