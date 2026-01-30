import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { eliminarCategoria } from '../../services/categoriaService';

const ModalEliminarCategoria = (props) => {
    const {cerrarModal, categoriaSeleccionada, setCategorias} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inputNombre.trim() !== "eliminar categoría") {
            setMessageError('El texto ingresado no coincide con "eliminar categoría".');
            return;
        }
        setMessageError("");
        setLoading(true);

        try {
            await eliminarCategoria(categoriaSeleccionada.id);
            setCategorias(prevCategorias =>
                prevCategorias.filter(categoria => categoria.id !== categoriaSeleccionada.id) 
            )
            toast.success("Categoría eliminada exitosamente");
            cerrarModal();
        } catch {
            toast.error("Ocurrió un error al eliminar la categoría");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
          isOpenModal={true}
          setIsOpenModal={cerrarModal}
          title="Eliminar categoría"
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p>Para confirmar la eliminación, escribe <strong>“eliminar categoría”</strong> en el campo a continuación.</p>
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
                        textButton="Eliminar categoría"
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
      );
      
};

export default ModalEliminarCategoria;    