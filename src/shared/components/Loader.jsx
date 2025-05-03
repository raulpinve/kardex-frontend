import React from 'react';
import { LuLoaderCircle } from 'react-icons/lu';

const Loader = ({className}) => {
    return (
        <div className={`flex justify-center items-center ${className ?? ""}`}>
            <LuLoaderCircle className="text-blue-600 text-3xl animate-spin" />
        </div>
    );
};

export default Loader;
