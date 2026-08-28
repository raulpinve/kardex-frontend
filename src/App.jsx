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
// import InventariosPagina from "./pages/inventarios/InventariosPagina";
import ProductosPagina from "./pages/productos/ProductosPagina";
import ProductoPagina from "./pages/productos/ProductoPagina";
// import InventarioProductoPagina from "./pages/inventarios/InventarioProductoPagina";
// import InventarioLotesPagina from "./pages/inventarios/InventarioLotesPagina";
import LotePagina from "./pages/productos/LotePagina";
import Layout from "./shared/components/Layout";
import SeleccionarAlmacenPage from "./shared/components/SeleccionarAlmacenPage";
import RequireAlmacen from "./shared/components/RequireAlmacen";
import { deleteAlmacen, setAlmacen } from "./store/almacenSlice";
import ListadoCortesPagina from "./pages/cortes/ListadoCortesPagina";
import CortesProductosPagina from "./pages/cortes/CortesProductosPagina";
import CortesProductoPagina from "./pages/cortes/CortesProductoPagina";
import CortesLotePagina from "./pages/cortes/CortesLotePagina";
import MiPlanPage from "./pages/miPlan/MiPlanPage";
import { setSuscripcion } from "./store/suscripcionSlice";
import RequireDesbloqueo from "./shared/components/RequireDesbloqueo";
import SeleccionarAlmacenesUsuariosBloqueados from "./shared/components/SeleccionarAlmacenesUsuariosBloqueados";

function App() {
  const dispatch = useDispatch();
  const [ loading, setLoading ] = useState(true);

  /* Validate the token */
  useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            dispatch(logout());
            setLoading(false);
            return;
        }

        axios.get(`${host}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(async (result) => {
            const { usuario, suscripcion, modoLectura } = result.data.data || {};

            if (!usuario) {
                // Si por alguna razón no llega usuario
                dispatch(logout());
                return;
            }

            // Dispatch al slice de usuario
            dispatch(login({ ...usuario, token }));

            // Dispatch al slice de suscripción
            dispatch(setSuscripcion({
                suscripcion: suscripcion || null,
                modoLectura: modoLectura ?? true // default true por seguridad
            }));

            // ✅ cargar almacén 
            const almacenSeleccionado = localStorage.getItem("almacenSeleccionado");
            if (almacenSeleccionado) {
              dispatch(setAlmacen(JSON.parse(almacenSeleccionado)));
            } else {
              dispatch(deleteAlmacen());
            }
        })
        .catch(() => {
            dispatch(logout());
        })
        .finally(() => {
            setLoading(false);
        });

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
        
        {/* Rutas protegidas con Layout persistente  */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path={`/desbloquear-almacenes-usuarios`} element={<SeleccionarAlmacenesUsuariosBloqueados />}/>
            <Route element={<RequireDesbloqueo />}>
                <Route path="/editar-perfil" element={<PerfilEditarPagina/>}/>
                <Route path="/perfil/:perfilId" element={<PerfilPagina/>}/>
                <Route path="/configuracion" element={<ConfiguracionPage/>}/>
                <Route path="/" element={<Navigate to="/medicamentos" replace />} />
                <Route path="/mi-plan" element={<MiPlanPage />} />

                {/* Rutas que requieren de almacén */}
                <Route path={`/seleccionar-almacen`} element={<SeleccionarAlmacenPage />}/>
                <Route element={<RequireAlmacen />}>
                    <Route path="/medicamentos" element={<ProductosPagina tipo = "medicamentos"/>} />
                    <Route path="/dispositivos" element={<ProductosPagina tipo = "dispositivos"/>} />
                    <Route path="/medicamentos/:productoId" element={<ProductoPagina tipo="medicamentos"/>}/>
                    <Route path="/dispositivos/:productoId" element={<ProductoPagina tipo="dispositivos"/>} />
                    <Route path="/medicamentos/lotes/:loteId" element={<LotePagina/>}/>
                    <Route path="/dispositivos/lotes/:loteId" element={< LotePagina/>}/>
                    <Route path="/lotes/:loteId" element={< LotePagina/>}/>

                    {/* Routes */}
                    <Route path="/cortes" element={<ListadoCortesPagina />}/>
                    <Route path="/cortes/:corteId" element={<CortesProductosPagina />}/>
                    <Route path="/cortes/:tipo/:corteId/:productoId/producto" element={<CortesProductoPagina />}/>
                    <Route path="/cortes/:corteId/:loteId/lote" element={<CortesLotePagina />}/>
                </Route>
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/inventarios" replace />} />
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
