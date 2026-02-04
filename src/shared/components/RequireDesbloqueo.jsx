import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireDesbloqueo = () => {
    const pendienteDesbloqueo = useSelector(state => state?.suscripcion?.suscripcion?.pendienteDesbloqueo);
    const usuario = useSelector((state) => state.auth.usuario);
    const location = useLocation();

    if(pendienteDesbloqueo && usuario?.rol === "superadmin"){
        return (
            <Navigate
                to="/desbloquear-almacenes-usuarios"
                state={{ from: location.pathname }}
                replace
            />
        );
    }
  return <Outlet />;
};

export default RequireDesbloqueo;