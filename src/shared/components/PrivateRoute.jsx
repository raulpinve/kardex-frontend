import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import VerificarEmail from "./VerificarEmail"
// import VerificarDowngrade from './VerificarDowngrade'

const PrivateRoute = ({ Component, ...rest}) => {
    const { isAuthenticated } = useSelector(state => state.auth)
    return isAuthenticated ?
    <>
        <Component {...rest}/>
        {/* <VerificarEmail/> */}
        {/* <VerificarDowngrade /> */}
    </> : <Navigate to="/login"/>
}

export default PrivateRoute