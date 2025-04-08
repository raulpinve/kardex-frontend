import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { eliminarMedicamento } from '../../services/medicamentosServices';

const ModalEliminarMedicamento = (props) => {
    const {cerrarModal, medicamentoSeleccionado, setMedicamentos} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");
    const token = useSelector(state => state.auth.token);

    console.log(medicamentoSeleccionado.id)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombreMedicamento = `${medicamentoSeleccionado.nombre}`.trim();

        if (inputNombre.trim() !== nombreMedicamento) {
            setMessageError("El nombre del principio activo no coincide con el del medicamento que desea eliminar.");
            return;
        }
        setMessageError("");
        setLoading(true);

        try {
            await eliminarMedicamento(token, medicamentoSeleccionado.id);
            setMedicamentos(prevMedicamentos =>
                prevMedicamentos.filter(medicamento => medicamento.id !== medicamentoSeleccionado.id) 
            )
            toast.success("Medicamento eliminado exitosamente");
            cerrarModal();
        } catch {
            toast.error("Ocurrió un error al eliminar el medicamento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
          isOpenModal={true}
          setIsOpenModal={cerrarModal}
          title="Eliminar Medicamento"
          description="Esta acción eliminará permanentemente al medicamento de la plataforma."
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar la eliminación, escribe el nombre del principio activo del medicamento <b>{medicamentoSeleccionado?.nombre}</b> en el campo a continuación:
                </p>
                <input 
                    type="text" 
                    className="input-form" 
                    value={inputNombre}
                    onChange={(e) => setInputNombre(e.target.value)}    
                />
            
                {messageError && (
                    <MessageError>
                        {messageError}
                    </MessageError>
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
                        textButton="Eliminar medicamento"
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
      );
      
};

export default ModalEliminarMedicamento;    