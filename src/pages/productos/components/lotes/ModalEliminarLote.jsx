import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { eliminarLote } from '../../services/loteServices';

const ModalEliminarLote = (props) => {
    const {cerrarModal, loteSeleccionado, setLotes} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");
    const token = useSelector(state => state.auth.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const numeroLote = `${loteSeleccionado.numeroLote}`.trim();

        if (inputNombre.trim() !== numeroLote) {
            setMessageError("El número de lote ingresado no coincide con el número de lote que desea eliminar.");
            return;
        }
        setMessageError("");
        setLoading(true);

        try {
            await eliminarLote(token, loteSeleccionado.id);
            setLotes(prevLotes =>
                prevLotes.filter(lote => lote.id !== loteSeleccionado.id) 
            )
            toast.success("Lote eliminado exitosamente");
            cerrarModal();
        } catch {
            toast.error("Ocurrió un error al eliminar el lote");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
          isOpenModal={true}
          setIsOpenModal={cerrarModal}
          title="Eliminar lote"
          description="Esta acción eliminará permanentemente al lote de la plataforma."
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar la eliminación, escribe el número del lote <b>{loteSeleccionado?.numeroLote}</b> en el campo a continuación:
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
                        textButton="Eliminar lote"
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
      );
      
};

export default ModalEliminarLote;    