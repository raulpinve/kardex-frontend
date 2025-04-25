import Modal from "../../../../shared/components/Modal";
import { toast } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateCorte } from "../../../../utils/utilities";
import { LuCalendar, LuChevronDown } from "react-icons/lu";
import { useEffect, useState } from "react";
import { obtenerCortes } from "../../services/cortesServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { crearAlmacen } from "../../services/almacenService";

const ModalSeleccionarCorte = (props) => {
    const {cerrarModal, corteSeleccionado, producto, lote} = props;
    const [mensajeError, setMensajeError] = useState();
    const [cortes, setCortes] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);
    const almacenId = useSelector(state => state.almacen.almacen?.id);

    // Obtener todos los cortes
    useEffect(() => {
        const fecthCortes = async () => {
            setLoading(false);
            try {
                const res = await obtenerCortes(token, almacenId);
                if (res?.data?.length > 0) {
                    setCortes(res.data);
                } else {
                    setMensajeError("No hay cortes disponibles para este almacén.");
                }
            } catch {
                setMensajeError("Ha ocurrido un error al cargar los cortes")                
            } finally {
                setLoading(true);
            }
        }
        if(token && almacenId){
            fecthCortes();
        }
    }, [token, almacenId])

    const cambiarCorteSeleccionado = (corteId) => {
        if(producto){
            navigate(`/inventarios/${corteId}/${producto.id}`);
        }else if(lote){
            navigate(`/inventarios/lote/${corteId}/${lote.id}`);
        }else{
            navigate(`/inventarios/${corteId}`);
        }
    }
    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Seleccionar corte"
            size="md"
        >
            {/* Seleccionar corte */}
            <div className="relative">
                <LuCalendar className="absolute left-3.5 top-[14px] dark:text-gray-200" />
                <select 
                    name="" id="" className="select-form  capitalize pl-10"
                    value={corteSeleccionado.id}
                    onChange={(e) => {
                        cambiarCorteSeleccionado(e.currentTarget.value)
                        toast("Corte seleccionado")
                        cerrarModal();
                    }}
                >
                    {cortes?.map(corte => {
                        return <option key={corte.id} value={corte.id}>
                            {formatDateCorte(corte.mes)}
                        </option>
                    })}
                </select>   
                <LuChevronDown className="absolute right-3.5 top-[13px] dark:text-gray-200" />                     
            </div>                
        </Modal>
    );
};

export default ModalSeleccionarCorte;