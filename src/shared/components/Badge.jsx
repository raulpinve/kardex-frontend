import React from 'react';

const Badge = ({tipo = "success", children}) => {
    let colores;

    if(tipo === "danger"){
        colores = "text-red-600 bg-red-50 dark:bg-red-500/15 dark:text-red-500";
    }else if(tipo === "success"){
        colores = "text-green-600 bg-green-50 dark:bg-green-500/15 dark:text-green-500";
    }else{
        colores = "text-blue-600 bg-blue-50 dark:bg-blue-500/15 dark:text-blue-500";
    }
    return (
        <span className={`flex ml-1 items-center gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-sm font-medium ${colores} `}>
            {children}
        </span>
    );
};

export default Badge;