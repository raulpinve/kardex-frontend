import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAlmacen = () => {
    const almacen = useSelector(state => state?.almacen?.almacen);
    const location = useLocation();

    if (!almacen) {
        return (
            <Navigate
                to="/seleccionar-almacen"
                state={{ from: location.pathname }}
                replace
            />
        );
    }
  return <Outlet />;
};

export default RequireAlmacen;