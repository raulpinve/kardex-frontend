import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import MessageError from "@/shared/components/MessageError";
import { cerrarCorte } from "../../services/cortesServices";
import { useNavigate } from "react-router-dom";
import { handleErrorsBasic } from "@/utils/handleErrors";

const ModalCerrarCorte = ({ cerrarModal, corteId }) => {
    const token = useSelector(state => state.auth.token);
    const [inputNombre, setInputNombre] = useState("");
    const [messageError, setMessageError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const textoIngresado = inputNombre.trim();

        if (textoIngresado !== "cerrar corte") {
            setMessageError("El texto ingresado no coincide con \"cerrar corte\".");
            return;
        }
        setMessageError("");
        setLoading(true);

        try {
            await cerrarCorte(token, corteId);
            toast.success("Corte cerrado exitosamente.");
            navigate(`/inventarios`);
            cerrarModal();
        } catch (error){
            handleErrorsBasic(error, setMessageError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Cerrar corte"
            description="Esta acción cerrará permanentemente el corte."
            size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar que deseas cerrar el corte, escribe el texto <b>cerrar corte</b> en el campo a continuación:
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
                        textButton="Cerrar corte"
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ModalCerrarCorte;
