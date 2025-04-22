import React from "react";
import { RiLoader4Fill } from "react-icons/ri";

const Spinner = ({ className }) => {
    return (
        <div className={`flex justify-center ${className}`}>
            <RiLoader4Fill className="animate-spin text-3xl text-blue-700" />
        </div>
    );
};

export default Spinner;