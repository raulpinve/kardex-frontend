import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { eliminarMovimiento } from '../../services/movimientoServices';
// import { eliminarLote } from '../../services/loteServices';

const ModalEliminarMovimiento = (props) => {
    const {cerrarModal, movimientoSeleccionado, setMovimientos} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [cantidad, setCantidad] = useState("");
    const token = useSelector(state => state.auth.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cantidadInput = `${movimientoSeleccionado.cantidad}`.trim();

        if (cantidad.trim() !== cantidadInput) {
            setMessageError("La cantidad ingresada no coincide con la cantidad que desea registrar para eliminar.");
            return;
        }
        
        setMessageError("");
        setLoading(true);

        try {
            await eliminarMovimiento(token, movimientoSeleccionado.id);
            setMovimientos(prevMovimientos =>
                prevMovimientos.filter(movimiento => movimiento.id !== movimientoSeleccionado.id) 
            )
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
          description="Esta acción eliminará permanentemente al movimiento de la plataforma."
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar la eliminación, escribe la cantidad del movimiento: <b>{movimientoSeleccionado?.cantidad}</b> en el campo a continuación:
                </p>
                <input 
                    type="text" 
                    className="input-form" 
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}    
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

export default ModalEliminarMovimiento;    