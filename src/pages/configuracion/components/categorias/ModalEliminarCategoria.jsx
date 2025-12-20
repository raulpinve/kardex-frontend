import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { eliminarCategoria } from '../../services/categoriaService';

const ModalEliminarCategoria = (props) => {
    const {cerrarModal, categoriaSeleccionada, setCategorias} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombreCategoria = `${categoriaSeleccionada.nombre}`.trim();

        if (inputNombre.trim() !== nombreCategoria) {
            setMessageError("El nombre ingresado no coincide con el nombre de la categoría que desea eliminar.");
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
          description="Esta acción eliminará permanentemente a la categoría de la plataforma."
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar la eliminación, escribe el nombre de la categoría <b>{categoriaSeleccionada?.nombre}</b> en el campo a continuación:
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