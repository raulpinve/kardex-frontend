import React from 'react';

const Card = ({children, className}) => {
    return (
        <div className={`overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
            {children}
        </div>
    );
};

export default Card;