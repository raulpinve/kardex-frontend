import React from 'react';

const CardTitulo = ({children, className}) => {
    return (
        <h3 className={`text-lg font-semibold text-gray-800 dark:text-white/90 py-1 ${className}`}>
            {children}
        </h3>
    );
};

export default CardTitulo;