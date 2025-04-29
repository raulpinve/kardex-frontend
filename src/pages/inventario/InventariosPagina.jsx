import React, { useEffect, useState } from "react";
import Layout from "../../shared/components/Layout";
import Button from "../../shared/components/Button";
import { LuSettings } from "react-icons/lu";
import ModalCrearCorte from "./components/cortes/ModalCrearCorte";
import { obtenerCorte, obtenerCortes } from "./services/cortesServices";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../shared/components/Spinner";
import Productos from "./components/productos/Productos";
import SeleccionarCorte from "./components/cortes/SeleccionarCorte";

const InventariosPagina = () => {
    const navigate = useNavigate();
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [ corteSeleccionado, setCorteSeleccionado ] = useState(null);
    const [ mensajeError, setMensajeError ] = useState(null);
    const [ modalActivo, setModalActivo ] = useState("");
    const [ cortes, setCortes ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const { corteId } = useParams();

    useEffect(() => {
        const cargarCorte = async () => {
            setLoading(true);
            setMensajeError(null);
            try {
                if (corteId) {
                    const res = await obtenerCorte(token, corteId);
                    if (res?.data?.id) {
                        setCorteSeleccionado(res.data);
                    } else {
                        setMensajeError("No se encontró el corte con ese ID.");
                    }
                } else if (almacenId) {
                    const res = await obtenerCortes(token, almacenId);
                    if (res?.data?.length > 0) {
                        navigate("/inventarios/" + res.data[0].id);
                    } else {
                        setMensajeError("No hay cortes disponibles para este almacén.");
                    }
                }
            } catch {
                setMensajeError("Error al cargar el lote.");
            } finally {
                setLoading(false);
            }
        };
        
        // 👉 Aquí va la verificación antes de llamar a cargarCorte
        if (!corteId && !almacenId) return;
        cargarCorte();

    }, [corteId, almacenId, navigate, token]);

    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <SeleccionarCorte corteSeleccionado={corteSeleccionado} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            textButton={`Crear corte`}
                            colorButton={`primary`}
                            className="min-w-[120px]"
                            onClick={() => setModalActivo("crear")}
                        />
                        
                        <Button 
                            colorButton={`secondary`}
                            className="h-[42px]"
                            title="Configuración"
                        > 
                            <LuSettings />
                        </Button>
                    </div>
                </div>
            </div>
            {mensajeError && (
                <p className="rounded mt-4 text-center text-gray-600 dark:text-gray-200">
                    {mensajeError}
               </p>
            )}

            {!mensajeError && loading && (
                <Spinner className={`mt-4`}/>
            )}
            {!loading && !mensajeError && corteSeleccionado && (<div>
                <Productos corteSeleccionado = {corteSeleccionado} tipo = "medicamentos" />
                <Productos corteSeleccionado = {corteSeleccionado} tipo = "dispositivos" />
            </div>)}

            {modalActivo === "crear" && (
                <ModalCrearCorte 
                    cerrarModal={() => setModalActivo(null)} 
                    corteSeleccionado = {corteSeleccionado}
                    setCortes = {setCortes}
                />
            )}
        </Layout>
    );
};

export default InventariosPagina;