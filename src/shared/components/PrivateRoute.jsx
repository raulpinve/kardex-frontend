import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SeleccionarAlmacen from './SeleccionarAlmacen'
// import VerificarEmail from "./VerificarEmail"
// import VerificarDowngrade from './VerificarDowngrade'

const PrivateRoute = ({ Component, ...rest}) => {
    const { isAuthenticated } = useSelector(state => state.auth)
    return isAuthenticated ?
    <>
        <Component {...rest}/>
        <SeleccionarAlmacen/>
        {/* <VerificarDowngrade /> */}
    </> : <Navigate to="/login"/>
}

export default PrivateRoute