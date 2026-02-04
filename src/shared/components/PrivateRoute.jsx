import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import VerificarEmail from "./VerificarEmail";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const emailVerificado = useSelector((state) => state?.auth?.usuario?.emailVerificado);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return (
        <>  
            {!emailVerificado && <VerificarEmail />}
            {children}
        </>
    );
};

export default PrivateRoute;