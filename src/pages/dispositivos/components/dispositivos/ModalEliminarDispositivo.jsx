import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { eliminarDispositivo } from '../../services/dispositivosServices';

const ModalEliminarDispositivo = (props) => {
    const {cerrarModal, dispositivoSeleccionado, setDispositivos} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");
    const token = useSelector(state => state.auth.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombreDispositivo = `${dispositivoSeleccionado.nombre}`.trim();

        if (inputNombre.trim() !== nombreDispositivo) {
            setMessageError("El nombre ingresado no coincide con el del dispositivo que quieres eliminar.");
            return;
        }
        setMessageError("");
        setLoading(true);

        try {
            await eliminarDispositivo(token, dispositivoSeleccionado.id);
            setDispositivos(prevDispositivos =>
                prevDispositivos.filter(dispositivo => dispositivo.id !== dispositivoSeleccionado.id) 
            )
            toast.success("Dispositivo eliminado exitosamente");
            cerrarModal();
        } catch {
            toast.error("Ocurrió un error al eliminar el dispositivo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
          isOpenModal={true}
          setIsOpenModal={cerrarModal}
          title="Eliminar dispositivo"
          description="Esta acción eliminará permanentemente al dispositivo de la plataforma."
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar la eliminación, escribe el nombre del dispositivo <b>{dispositivoSeleccionado?.nombre}</b> en el campo a continuación:
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

export default ModalEliminarDispositivo;    