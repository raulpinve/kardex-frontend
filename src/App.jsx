import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./shared/components/Layout";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { login, logout } from "./store/authSlice";
import { RiLoader4Fill } from "react-icons/ri";
import PrivateRoute from "./shared/components/PrivateRoute";
import SolicitarRestablecerContrasena from "./pages/auth/SolicitarRestablecerContrasena";
import RestablecerContrasena from "./pages/auth/RestablecerContrasena";
import ConfiguracionPage from "./pages/configuracion/ConfiguracionPage";
import { host } from "./utils/config";

function App() {
  const dispatch = useDispatch();
  const [ loading, setLoading ] = useState(true);

  /* Validate the token */
  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token){
      axios.get(`${host}/validateToken`, {
          headers: {
            Authorization: `Bearer ${token}` // Reemplaza 'token' con tu token de autorización
          }
        })
        .then(result => {
          dispatch(login({
            ...result.data.data, 
            token
          }))
        })
        .catch(() => {
          dispatch(logout())
        })
        .finally(() => {
          setLoading(false)
        })
    }else{
      dispatch(logout())
      setLoading(false)
    }
  }, [dispatch])
    
  if (loading) {
    return (
      <div className="min-h-screen min-w-screen flex justify-center items-center bg-slate-100">
        <RiLoader4Fill className="animate-spin text-5xl text-blue-700" />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute Component={Layout} />} />
        <Route path="/solicitar-restablecer-contrasena" element={<SolicitarRestablecerContrasena />} />
        <Route path="/restablecer-contrasena/:token" element={<RestablecerContrasena />} />
        <Route path="/configuracion" element={<PrivateRoute Component={ConfiguracionPage} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
