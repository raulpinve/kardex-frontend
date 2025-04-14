import React from 'react';
import { LuLoaderCircle } from 'react-icons/lu';

const Loader = () => {
    return (
        <div className="flex justify-center items-center">
            <LuLoaderCircle className="text-blue-600 text-3xl animate-spin" />
        </div>
    );
};

export default Loader;
