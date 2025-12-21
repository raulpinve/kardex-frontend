import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import VerificarEmail from "./VerificarEmail";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
      {/* <VerificarEmail /> */}
    </>
  );
};

export default PrivateRoute;