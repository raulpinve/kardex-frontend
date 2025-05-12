import SkeletonElement from "../../../../shared/components/SkeletonElement";
import { formatDateCorte } from "../../../../utils/utilities";
import { obtenerCorte } from "../../services/cortesServices";
import Badge from "../../../../shared/components/Badge";
import SeleccionarCorte from "./SeleccionarCorte";
import { useParams } from "react-router-dom";
import { LuCalendar } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Corte = () => {
    const token = useSelector(state => state.auth.token);
    const [modalActivo, setModalActivo] = useState(null);
    const [corte, setCorte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { corteId } = useParams();

    useEffect(() => {
        const fetchCorte = async () => {
            setLoading(true);
            try {
                const res = await obtenerCorte(token, corteId);
                if (res?.data?.id) {
                    setCorte(res.data);
                }
            } catch{
                setError("Error al cargar lote")
            } finally {
                setLoading(false);
            }
        }
        if(!corteId) return;
        fetchCorte();
    }, [token, corteId])

    return (<> 
        {loading && (<SkeletonElement className="w-[150px] h-[42px]" />)}
            {!loading && !error && corte && (<div className="flex items-center">
                <Badge className={`h-[25px] mr-[10px]`} tipo = {corte?.cerrado === true ? "danger": "success"}>{corte?.cerrado == true ? "Cerrado" : "Activo" }</Badge>
                <div 
                    onClick={() => {setModalActivo(true)}}
                    className="py-2 px-4 cursor-pointer border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg bg-white flex gap-2 items-center"
                >
                    <LuCalendar />
                    <p>{`${formatDateCorte(corte?.fechaInicio)} - ${formatDateCorte(corte?.fechaFin)}`}</p>
                </div>
            </div>
        )}
        {modalActivo && (
            <SeleccionarCorte 
                cerrarModal = {() => setModalActivo(false)}
            />
        )}
    </>);
};

export default Corte;
