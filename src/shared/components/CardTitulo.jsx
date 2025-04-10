import React from 'react';

const CardTitulo = ({children}) => {
    return (
        <h3 className='text-lg capitalize font-semibold text-gray-800 dark:text-white/90 py-1'>
            {children}
        </h3>
    );
};

export default CardTitulo;