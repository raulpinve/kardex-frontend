import { obtenerCortePeriodo } from "../../services/cortesServices";
import { formatDateCorte } from "../../../../utils/utilities";
import Badge from "../../../../shared/components/Badge";
import SeleccionarCorte from "./SeleccionarCorte";
import { useParams } from "react-router-dom";
import { LuCalendar, LuChevronRight } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Corte = () => {
    const [modalActivo, setModalActivo] = useState(null);
    const token = useSelector(state => state.auth.token);
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const [corte, setCorte]= useState(null);
    const [ mensajeError, setMensajeError ] = useState(null);
    const { periodo } = useParams();

    // Obtener corte
    useEffect(() => {
        const cargarCorte = async () => {
            setMensajeError(null);
            try {
                const res = await obtenerCortePeriodo(token, periodo, almacenId);
                if (res?.data?.id) {
                    setCorte(res.data);
                }
            } catch (error){
                setMensajeError(error?.response?.data?.message || "Ha ocurrido un error al intentar cargar el corte.")
            } 
        };
        if (!periodo || !almacenId) return;
        cargarCorte();

    }, [periodo,  almacenId, token]);

    return (<> 
        <div className="flex items-center">
            <LuChevronRight />
            {periodo && (
                <div 
                    onClick={() => setModalActivo(true)}
                    // className="py-2 px-4 cursor-pointer border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold rounded-lg bg-white dark:bg-gray-800 flex gap-2 items-center"
                >
                    {/* <LuCalendar /> */}
                    <p>{formatDateCorte(periodo)}</p>
                </div>
            )}
        </div>
        {modalActivo && (
            <SeleccionarCorte 
                cerrarModal = {() => setModalActivo(false)}
            />
        )}
    </>);
};

export default Corte;
