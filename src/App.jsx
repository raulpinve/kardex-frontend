import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
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
import { Toaster } from 'sonner';
import PerfilEditarPagina from "./pages/perfil/PerfilEditarPagina";
import PerfilPagina from "./pages/perfil/PerfilPagina";
import VerificarEmailPage from "./pages/auth/VerificarEmailPage";
import InventariosPagina from "./pages/inventarios/InventariosPagina";
import ProductosPagina from "./pages/productos/ProductosPagina";
import ProductoPagina from "./pages/productos/ProductoPagina";
import InventarioProductoPagina from "./pages/inventarios/InventarioProductoPagina";
import InventarioLotesPagina from "./pages/inventarios/InventarioLotesPagina";
import LotePagina from "./pages/productos/LotePagina";
import Layout from "./shared/components/Layout";

function App() {
  const dispatch = useDispatch();
  const [ loading, setLoading ] = useState(true);

  /* Validate the token */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`${host}/validateToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          dispatch(login({ ...result.data.data, token }));
        })
        .catch(() => {
          dispatch(logout());
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      dispatch(logout());
      setLoading(false);
    }
  }, [dispatch]);

  // Configuración para toaster
  const [isDark, setIsDark] = useState();
  useEffect(() => {
    setIsDark(localStorage.getItem("theme") === "dark")
  }, [])

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
        <Route path="/" element={<Navigate to="/inventarios" replace />} />
          {/* Rutas protegidas con Layout persistente  */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/inventarios/:periodo?" element={<InventariosPagina />}/>
            <Route path="/inventarios/:periodo/:productoId" element={<InventarioProductoPagina/>}/>
            <Route path="/inventarios/:periodo/:loteId/lote" element={<InventarioLotesPagina/>}/>
            <Route path="/configuracion" element={<ConfiguracionPage/>}/>
            <Route path="/editar-perfil" element={<PerfilEditarPagina/>}/>
            <Route path="/perfil/:perfilId" element={<PerfilPagina/>}/>
            <Route path="/medicamentos" element={<ProductosPagina tipo = "medicamentos"/>} />
            <Route path="/dispositivos" element={<ProductosPagina tipo = "dispositivos"/>} />
            <Route path="/medicamentos/:productoId" element={<ProductoPagina tipo="medicamentos"/>}/>
            <Route path="/dispositivos/:productoId" element={<ProductoPagina tipo="dispositivos"/>} />
            <Route path="/medicamentos/lotes/:loteId" element={<LotePagina/>}/>
            <Route path="/dispositivos/lotes/:loteId" element={< LotePagina/>}/>
            <Route path="/lotes/:loteId" element={< LotePagina/>}/>
        </Route>
        
        <Route path="/:token/verificar-email" element={<VerificarEmailPage />} />
        <Route path="/restablecer-contrasena/:token" element={<RestablecerContrasena />} />
        <Route path="/solicitar-restablecer-contrasena" element={<SolicitarRestablecerContrasena />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      <Toaster richColors theme={isDark ? "dark" : "light"}/>
    </BrowserRouter>
  )
}

export default App
