import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { eliminarProducto } from '../../services/productoServices';

const ModalEliminarProducto = (props) => {
    const {cerrarModal, productoSeleccionado, tipo, setProductos} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");
    const token = useSelector(state => state.auth.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombreMedicamento = `${productoSeleccionado.nombre}`.trim();

        if (inputNombre.trim() !== nombreMedicamento) {
            setMessageError(`El ${tipo === "medicamentos" ? "principio activo": "nombre"} no coincide con el del 
                ${tipo === "medicamentos" ? "medicamento" : "dispositivo"} que desea eliminar.`);
            return;
        }
        setMessageError("");
        setLoading(true);

        try {
            await eliminarProducto(token, tipo, productoSeleccionado.id);
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
          description={`Esta acción eliminará permanentemente al ${tipo === "medicamentos" ? "medicamento": "dispositivo"} de la plataforma.`}
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar la eliminación, escribe {tipo === "medicamentos"? "el principio activo del medicamento": "el nombre del dispositivo"} <b>{productoSeleccionado?.nombre}</b> en el campo a continuación:
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