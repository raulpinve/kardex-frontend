import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { handleErrorsBasic } from '@/utils/handleErrors';
import { eliminarLote } from '../../services/loteServices';

const ModalEliminarLote = (props) => {
    const {cerrarModal, loteSeleccionado, setLotes, updateRefresh} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inputNombre.trim() !== "eliminar lote") {
            setMessageError("El texto ingresado no coincide con \"eliminar lote\"");
            return;
        }
        setMessageError("");
        setLoading(true);

        try {
            await eliminarLote(loteSeleccionado.id);
            setLotes(prevLotes =>
                prevLotes.filter(lote => lote.id !== loteSeleccionado.id) 
            )
            toast.success("Lote eliminado exitosamente");
            updateRefresh();
            cerrarModal();
        } catch (error){
            handleErrorsBasic(error, setMessageError)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
          isOpenModal={true}
          setIsOpenModal={cerrarModal}
          title="Eliminar lote"
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar la eliminación, escribe el texto "<b>eliminar lote</b>" en el campo a continuación:
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
                
                <div className="mt-3 text-red-600 text-sm">
                    <h2 className="font-semibold">Esta acción es irreversible.</h2>
                    <p>Al eliminar este lote, se perderá permanentemente todo el historial y la información asociada. No podrás recuperar ni restaurar estos datos.</p>
                </div>
            
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