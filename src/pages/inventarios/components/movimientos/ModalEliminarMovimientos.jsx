import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { eliminarMovimiento } from '../../services/movimientosServices';

const ModalEliminarMovimientos = (props) => {
    const {cerrarModal, movimientoSeleccionado, setMovimientos, onCambioMovimientos} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [textoEscrito, setTextoEscrito] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (textoEscrito.trim() !== "eliminar movimiento") {
            setMessageError('El texto ingresado no coincide con "eliminar movimiento".');
            return;
        }
        
        setMessageError("");
        setLoading(true);

        try {
            await eliminarMovimiento(movimientoSeleccionado.id);
            setMovimientos(prevMovimientos =>
                prevMovimientos.filter(movimiento => movimiento.id !== movimientoSeleccionado.id) 
            )
            onCambioMovimientos();
            toast.success("Movimiento eliminado exitosamente");
            cerrarModal();
        } catch {
            toast.error("Ocurrió un error al eliminar el movimiento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
          isOpenModal={true}
          setIsOpenModal={cerrarModal}
          title="Eliminar movimiento"
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar la eliminación, escribe <b>"eliminar movimiento"</b> en el campo de abajo:
                </p>
                <input 
                    type="text" 
                    className="input-form" 
                    value={textoEscrito}
                    onChange={(e) => setTextoEscrito(e.target.value)}    
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
                        textButton="Eliminar movimiento"
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
      );
      
};

export default ModalEliminarMovimientos;    