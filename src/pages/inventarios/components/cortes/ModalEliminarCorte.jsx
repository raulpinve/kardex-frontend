import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import MessageError from "@/shared/components/MessageError";
import { useNavigate, useParams } from "react-router-dom";
import { eliminarCorte } from "../../services/cortesServices";

const ModalEliminarCorte = ({ cerrarModal }) => {
    const token = useSelector(state => state.auth.token);
    const [inputNombre, setInputNombre] = useState("");
    const [messageError, setMessageError] = useState("");
    const [loading, setLoading] = useState(false);
    const { corteId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const textoIngresado = inputNombre.trim();

        if (textoIngresado !== "eliminar corte") {
            setMessageError("El texto ingresado no coincide con \"eliminar corte\".");
            return;
        }

        setMessageError("");
        setLoading(true);

        try {
            await eliminarCorte(token, corteId);
            toast.success("Corte eliminado exitosamente.");
            navigate(`/inventarios`);
            cerrarModal();
        } catch (error){
            setMessageError(error?.response?.data?.message || "Ha ocurrido un error al intentar cerrar el corte. Por favor, inténtalo de nuevo.")
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Eliminar corte"
            description="Esta acción eliminará permanentemente el corte."
            size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar que deseas eliminar el corte, escribe el texto <b>eliminar corte</b> en el campo a continuación:
                </p>
                <input 
                    type="text" 
                    className="input-form" 
                    value={inputNombre}
                    onChange={(e) => setInputNombre(e.target.value)}    
                />
                {messageError && (
                    <MessageError>{messageError}</MessageError>
                )}
            
                <div className="mt-4 flex justify-end gap-2">
                    <Button 
                        colorButton="secondary"
                        textButton="Cancelar"
                        type="button"
                        onClick={() => cerrarModal(false)}
                    />
                    <Button 
                        colorButton="danger"
                        textButton="Eliminar corte"
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ModalEliminarCorte;
