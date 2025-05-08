import { obtenerCorte, obtenerCortes } from "./services/cortesServices";
import Corte from "./components/cortes/InformacionCorte";
import ModalCrearCorte from "./components/cortes/ModalCrearCorte";
import { useNavigate, useParams } from "react-router-dom";
import Productos from "./components/productos/Productos";
import Spinner from "../../shared/components/Spinner";
import Button from "../../shared/components/Button";
import Layout from "../../shared/components/Layout";
import React, { useEffect, useState } from "react";
import { LuSettings } from "react-icons/lu";
import { useSelector } from "react-redux";
import CardTitulo from "../../shared/components/CardTitulo";

const InventariosPagina = () => {
    const navigate = useNavigate();
    const {corteId} = useParams();
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [ mensajeError, setMensajeError ] = useState(null);
    const [ modalActivo, setModalActivo ] = useState("");
    const [ loading, setLoading ] = useState(true);

    // Obtener corte
    useEffect(() => {
        const cargarCorte = async () => {
            setLoading(true);
            setMensajeError(null);
            try {
                if (corteId) {
                    const res = await obtenerCorte(token, corteId);
                    if (!res?.data?.id) {
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
            } catch{
                setMensajeError("Ocurrió un error al obtener el lote. Por favor, inténtalo otra vez.");
            } finally {
                setLoading(false);
            }
        };
        
        if (!corteId && !almacenId) return;
        cargarCorte();

    }, [corteId, almacenId, navigate, token]);

    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                    <div className="">
                        <CardTitulo className="flex items-center">
                            Inventarios 
                        </CardTitulo>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                            <Corte />
                            <Button
                                textButton={`Crear corte`}
                                colorButton={`primary`}
                                className="min-w-[120px]"
                                onClick={() => setModalActivo("crear")}
                            />
                            <Button 
                                colorButton={`secondary`}
                                title="Configuración"
                            > 
                                <LuSettings />
                            </Button>
                        </div>
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
            {!loading && !mensajeError && corteId && (<div>
                <Productos corteSeleccionado = {corteId} tipo = "medicamentos" />
                <Productos corteSeleccionado = {corteId} tipo = "dispositivos" />
            </div>)}

            {modalActivo === "crear" && (
                <ModalCrearCorte 
                    cerrarModal={() => setModalActivo(null)} 
                />
            )}
        </Layout>
    );
};

export default InventariosPagina;