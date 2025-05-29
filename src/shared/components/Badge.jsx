import React from 'react';

const Badge = ({ tipo = "success", children, className }) => {
  let colores;

  if (tipo === "danger") {
    colores = "text-red-600 bg-red-50 dark:bg-red-500/15 dark:text-red-500";
  } else if (tipo === "warning") {
    colores = "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/15 dark:text-yellow-500";
  } else {
    colores = "text-green-600 bg-green-50 dark:bg-green-500/15 dark:text-green-500";
  }

  return (
    <span className={`flex ml-1 items-center gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-sm font-medium ${colores} ${className || ""}`}>
      {children}
    </span>
  );
};

export default Badge;
