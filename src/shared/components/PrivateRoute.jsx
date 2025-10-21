import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SeleccionarAlmacen from "./SeleccionarAlmacen";
import VerificarEmail from "./VerificarEmail";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
      <SeleccionarAlmacen />
      {/* <VerificarEmail /> */}
    </>
  );
};

export default PrivateRoute;