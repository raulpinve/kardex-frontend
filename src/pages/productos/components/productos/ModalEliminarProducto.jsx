import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { eliminarProducto } from '../../services/productoServices';

const ModalEliminarProducto = (props) => {
    const {cerrarModal, productoSeleccionado, tipo, setProductos} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inputNombre.trim() !== `eliminar ${tipo === "medicamentos"? "medicamento": "dispositivo"}`) {
            setMessageError(`El texto ingresado no coincide con "${tipo === "medicamentos"? "medicamento": "dispositivo"}".`);
            return;
        }
        setMessageError("");
        setLoading(true);

        try {
            await eliminarProducto(tipo, productoSeleccionado.id);
            setProductos(prevProductos =>
                prevProductos.filter(producto => producto.id !== productoSeleccionado.id) 
            )
            toast.success(`${tipo === "medicamentos" ? "Medicamento": "Dispositivo"} eliminado exitosamente`);
            cerrarModal();
        } catch (error){
            const mensaje = error?.response?.data?.message || `Ocurrió un error al eliminar el ${tipo === "medicamentos" ? "medicamento": "dispositivo"}.`;
            toast.error(mensaje);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
          isOpenModal={true}
          setIsOpenModal={cerrarModal}
          title={`Eliminar ${tipo === "medicamentos"? "medicamento": "dispositivo"}`}
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p>Para confirmar la eliminación, escribe <strong>“eliminar {tipo === "medicamentos"? "medicamento": "dispositivo"}”</strong> en el campo a continuación.</p>
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
                        textButton={`Eliminar ${tipo === "medicamentos" ? "medicamento": "dispositivo"}`}
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
      );
      
};

export default ModalEliminarProducto;    