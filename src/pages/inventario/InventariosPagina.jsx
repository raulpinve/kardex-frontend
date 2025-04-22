import React, { useEffect, useState } from "react";
import Layout from "../../shared/components/Layout";
import CardTitulo from "../../shared/components/CardTitulo";
import Button from "../../shared/components/Button";
import { LuChevronDown, LuChevronRight, LuCircleAlert, LuCircleCheck, LuSettings } from "react-icons/lu";
import CorteMedicamentos from "./components/medicamentos/CorteMedicamentos";
import ModalCrearCorte from "./components/cortes/ModalCrearCorte";
import ModalSeleccionarCorte from "./components/cortes/ModalSeleccionarCorte";
import { formatDateCorte } from "../../utils/utilities";
import { obtenerCorte, obtenerCortes } from "./services/cortesServices";
import { useSelector } from "react-redux";
import Badge from "../../shared/components/Badge";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../shared/components/Spinner";

const InventariosPagina = () => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [ corteSeleccionado, setCorteSeleccionado ] = useState(null);
    const [ mensajeError, setMensajeError ] = useState(null);
    const [ modalActivo, setModalActivo ] = useState("");
    const [ cortes, setCortes ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const { corteId } = useParams();
    const navigate = useNavigate();

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
    }, [corteId, almacenId]);
      
    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            <CardTitulo className={`flex items-center`}>Inventarios 
                                {corteSeleccionado?.mes && (<>
                                    <LuChevronRight /> 
                                    <span 
                                        className="text-blue-600 cursor-pointer ml-1"
                                        onClick={() => {setModalActivo("seleccionar-corte")}}
                                    >
                                        {formatDateCorte(corteSeleccionado?.mes)}
                                    </span>
                                    {corteSeleccionado?.cerrado ? 
                                        <Badge tipo="danger"> Cerrado</Badge>:
                                        <Badge> Activo </Badge>                                    
                                    }
                                </>)}
                            </CardTitulo>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            textButton={`Crear corte`}
                            colorButton={`primary`}
                            className="min-w-[120px]"
                            onClick={() => setModalActivo("crear")}
                        />

                        {/* Seleccionar tipo */}
                        <div className="relative">
                            <select name="" id="" className="select-form bg-white">
                                <option value="">Medicamentos</option>
                                <option value="">Dispositivos</option>
                            </select>   
                            <LuChevronDown className="absolute right-3.5 top-[13px] dark:text-gray-200" />                     
                        </div>
                        
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
                <CorteMedicamentos corteSeleccionado = {corteSeleccionado} />
            </div>)}

            {modalActivo === "crear" && (
                <ModalCrearCorte 
                    cerrarModal={() => setModalActivo(null)} 
                    corteSeleccionado = {corteSeleccionado}
                    setCortes = {setCortes}
                />
            )}

            {modalActivo === "seleccionar-corte" && (
                <ModalSeleccionarCorte 
                    cerrarModal={() => setModalActivo(null)} 
                    corteSeleccionado = {corteSeleccionado}
                    setCorteSeleccionado = {setCorteSeleccionado}
                    cortes = {cortes}
                    setCortes = {setCortes}
                />
            )}
        </Layout>
    );
};

export default InventariosPagina;