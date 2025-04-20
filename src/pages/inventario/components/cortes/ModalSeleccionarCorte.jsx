import Modal from "../../../../shared/components/Modal";
import { toast } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateCorte } from "../../../../utils/utilities";
import { LuCalendar, LuChevronDown } from "react-icons/lu";
// import { crearAlmacen } from "../../services/almacenService";

const ModalSeleccionarCorte = (props) => {
    const { cerrarModal, cortes, setCortes } = props;

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
                    onChange={(e) => {
                        setCortes(e.currentTarget.value)
                        cerrarModal();
                        toast("Corte seleccionado")
                    }}
                >
                    {
                        cortes?.map(corte => {
                            return <option key={corte.id} value={corte.id}>{formatDateCorte(corte.mes)}</option>
                        })
                    }
                </select>   
                <LuChevronDown className="absolute right-3.5 top-[13px] dark:text-gray-200" />                     
            </div>                
        </Modal>
    );
};

export default ModalSeleccionarCorte;