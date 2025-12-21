import React from 'react';

const Title = ({ children }) => {
    return (
        <h2 className='font-semibold text-2xl text-gray-700 dark:text-white/90 my-3'>{children}</h2>
    )
}

export default Title;