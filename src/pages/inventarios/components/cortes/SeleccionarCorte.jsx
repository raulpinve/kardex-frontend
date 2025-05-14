import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { LuCalendar, LuChevronDown } from 'react-icons/lu';
import { obtenerCortes } from '../../services/cortesServices';
import { useSelector } from 'react-redux';
import { formatDateCorte } from '../../../../utils/utilities';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import SkeletonElement from '../../../../shared/components/SkeletonElement';
import MessageError from '../../../../shared/components/MessageError';

const SeleccionarCorte = (props) => {
    const {periodo} = useParams();
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [mensajeError, setMensajeError] = useState();
    const [cortes, setCortes] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const {cerrarModal} = props;

    // Obtener los ultimos cortes
    useEffect(() => {
        const fecthCortes = async () => {
            setLoading(true);
            try {
                const res = await obtenerCortes(token, almacenId);
                setCortes(res?.data);
            } catch (error) {
                setMensajeError(error?.response?.data?.message || "No se pudo obtener la información de los cortes. Por favor, inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        }
        fecthCortes();
    }, [token, almacenId]);

    const cambiarCorteSeleccionado = (nuevoCorteId) => {
        // Si no tiene la estructura esperada
        navigate(`/inventarios/${nuevoCorteId}`);
    };

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Seleccionar corte"
            size="md"
        >
            {loading && (
                <SkeletonElement className="h-[44px]" />
            )}
            {!loading && mensajeError && (
                <MessageError>{MessageError}</MessageError>
            )}
            {!loading && !mensajeError && cortes && (
                <div className="relative">
                    <LuCalendar className="absolute left-3.5 top-[14px] dark:text-gray-200" />
                        <select 
                            className="select-form pl-10"
                            value={periodo}
                            onChange={(e) => {
                                cambiarCorteSeleccionado(e.currentTarget.value);
                                toast.success("Corte seleccionado");
                                cerrarModal();
                            }}
                        >
                        <option value="" disabled>Selecciona un corte</option>
                        {cortes.map(corte => <option key={corte.id} value={corte.periodo}>
                            {`${formatDateCorte(corte.periodo)} ${!corte?.cerrado ? "(activo)": ""}`}
                        </option>)}
                    </select>   
                    <LuChevronDown className="absolute right-3.5 top-[13px] dark:text-gray-200" />                     
                </div>                           
            )}
        </Modal>
    );
};

export default SeleccionarCorte;