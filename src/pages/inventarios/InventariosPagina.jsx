import { obtenerCortePeriodo, obtenerCortes } from "./services/cortesServices";
import ModalCrearCorte from "./components/cortes/ModalCrearCorte";
import { useNavigate, useParams } from "react-router-dom";
import Productos from "./components/productos/Productos";
import Spinner from "../../shared/components/Spinner";
import Button from "../../shared/components/Button";
import Layout from "../../shared/components/Layout";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DropdownEditarCorte from "./components/cortes/DropdownEditarCorte";
import TituloInventarios from "./components/TituloInventarios";

const InventariosPagina = () => {
    const navigate = useNavigate();
    const {periodo} = useParams();
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [corte, setCorte]= useState(null);
    const [ mensajeError, setMensajeError ] = useState(null);
    const [ modalActivo, setModalActivo ] = useState("");
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const cargarCorte = async () => {
            setLoading(true);
            setMensajeError(null);
            try {
                if (periodo && almacenId) {
                    const res = await obtenerCortePeriodo(token, periodo, almacenId);
                    if (res?.data?.id) {
                        setCorte(res.data);
                    }else{
                        setMensajeError("No se encontró corte para esa fecha.");
                    }
                } else if (almacenId) {
                    const res = await obtenerCortes(token, almacenId);
                    if (res?.data?.length > 0) {
                        navigate("/inventarios/" + res.data[0].periodo);
                    } else {
                        setMensajeError("No hay cortes disponibles para este almacén.");
                    }
                }
            } catch (error){
                setMensajeError(error?.response?.data?.message || "Ocurrió un error al obtener el lote. Por favor, inténtalo otra vez.");
            } finally {
                setLoading(false);
            }
        };

        cargarCorte();
    }, [periodo,  almacenId, navigate, token]);

    return (
        <Layout>
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between gap-2">
                <TituloInventarios corte={corte} />
                <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                        <Button
                            colorButton={`primary`}
                            onClick={() => setModalActivo("crear")}
                        >
                            Crear corte 
                        </Button>
                        {corte && !corte?.cerrado &&(
                            <DropdownEditarCorte corteId={corte?.id} />
                        )}
                    </div>
                </div>
            </div>
            {mensajeError && (
                <p className="rounded mt-4 text-center text-sm text-gray-600 dark:text-gray-200">
                    {mensajeError}
               </p>
            )}

            {!mensajeError && loading && (
                <Spinner className={`mt-4`}/>
            )}
            {!loading && !mensajeError && corte && (<div className="mt-6">
                <Productos tipo = "medicamentos" corteId={corte.id} />
                <Productos tipo = "dispositivos" corteId={corte.id} />
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