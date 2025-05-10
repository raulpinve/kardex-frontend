import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { LuChevronDown, LuTriangleAlert } from "react-icons/lu";

import Button from "../../../../shared/components/Button";
import MessageError from "../../../../shared/components/MessageError";
import { obtenerFechaCorte } from "../../services/cortesServices";

const PERIODOS = ["semanal", "quincenal", "mensual", "trimestral", "semestral", "anual"];
const DIAS_SEMANA = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

const CambiarPeriodicidadCorte = ({ setTituloModal, setSeccionSeleccionada, cerrarModal }) => {
    const almacenId = useSelector(state => state?.almacen?.almacen?.id);
    const tipoCortePreferido = useSelector(state => state?.almacen?.almacen?.tipoCortePreferido);
    const token = useSelector(state => state.auth.token);

    const [diaCorteSemana, setDiaCorteSemana] = useState(null);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState(tipoCortePreferido);
    const [cambiarPeriodo, setCambiarPeriodo] = useState(false);
    const [mostarAdvertencia, setMostrarAdvertencia] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const [periodo, setPeriodo] = useState(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchPeriodicidad = async () => {
            if (!cambiarPeriodo) return;
            if (periodoSeleccionado === "semanal" && !diaCorteSemana) return;
         
            setMostrarAdvertencia(false);
            setLoading(true);
            try {
                const res = await obtenerFechaCorte(token, almacenId, periodoSeleccionado, diaCorteSemana);
                setPeriodo(res.data);
                setMostrarAdvertencia(true);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPeriodicidad();
    }, [cambiarPeriodo, periodoSeleccionado, diaCorteSemana, almacenId, token]);

    const handlePeriodoChange = (e) => {
        const nuevoPeriodo = e.target.value;
        setPeriodoSeleccionado(nuevoPeriodo);
        setDiaCorteSemana(""); 
        setCambiarPeriodo(true);
    };

    const submitNuevoPeriodo = async () => {
        try {
            setLoading(true);
            const data = {
                tipoCorte: periodoSeleccionado,
                diaInicioSemana: diaCorteSemana
            }
            console.log(data)
        } catch (error) {
            setMessageError(error?.response?.data?.message || "Ocurrió un error interno. Por favor, inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Selección de período */}
            <div>
                <label className="label-form">
                    Período <span className="input-required">*</span>
                </label>
                <div className="relative">
                    <select
                        className="select-form"
                        value={periodoSeleccionado}
                        onChange={handlePeriodoChange}
                    >
                        <option value="" disabled>Selecciona un periodo... </option>
                        {PERIODOS.map(p => (
                            <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>
                        ))}
                    </select>
                    <LuChevronDown className="absolute right-3.5 top-[13px] dark:text-gray-200" />
                </div>
            </div>

            {/* Selección de día si es semanal */}
            {periodoSeleccionado === "semanal" && (
                <div>
                    <label className="label-form">
                        Día de corte de la semana <span className="input-required">*</span>
                    </label>
                    <select
                        className="select-form"
                        value={diaCorteSemana}
                        onChange={(e) => setDiaCorteSemana(e.target.value)}
                    >
                        <option value="" disabled>Seleccionar día...</option>
                        {DIAS_SEMANA.map(d => (
                            <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Aviso de impacto y nueva fecha estimada */}
            {!loading && mostarAdvertencia && (<div className="bg-yellow-100 p-4 rounded-lg mt-2 flex items-start gap-3">
                <div className="mt-0.5 text-yellow-700">
                    <LuTriangleAlert />
                </div>
                <p className="text-sm text-yellow-700">
                    Al modificar la periodicidad del corte, el próximo se generará en una fecha posterior, lo que podría generar un vacío en el ciclo actual. Este ajuste podría afectar la continuidad habitual del proceso. 
                    {periodo?.periodoCorte && (<> El nuevo corte será: <strong>{periodo.periodoCorte}</strong>.</>)}
                </p>
            </div>)}

            {messageError && (
                <MessageError>
                    Hola
                </MessageError>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between items-center mt-4">
                <Button
                    colorButton="secondary"
                    onClick={() => {
                        setTituloModal("Configuración");
                        setSeccionSeleccionada(null);
                    }}
                >
                    <IoIosArrowRoundBack />
                    Regresar
                </Button>
                <div className="flex justify-end gap-2">
                    <Button
                        colorButton="secondary"
                        textButton="Cerrar"
                        type="button"
                        onClick={() => cerrarModal(false)}
                    />
                    <Button
                        colorButton="primary"
                        textButton="Guardar cambios"
                        loading={loading}
                        type="submit"
                        onClick={submitNuevoPeriodo}
                    />
                </div>
            </div>
        </>
    );
};

export default CambiarPeriodicidadCorte;
