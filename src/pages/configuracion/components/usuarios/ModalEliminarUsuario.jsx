import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import Button from '../../../../shared/components/Button';
import { eliminarUsuario } from '../../services/usuarioService';
import { toast } from 'sonner';

const ModalEliminarUsuario = (props) => {
    const {cerrarModal, usuarioSeleccionado, setUsuarios} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombreCompleto = `${usuarioSeleccionado.primerNombre} ${usuarioSeleccionado.apellidos}`.trim();

        if (inputNombre.trim() !== nombreCompleto) {
            setMessageError("El nombre ingresado no coincide con el usuario seleccionado.");
            return;
        }
        setMessageError("");
        setLoading(true);

        try {
            await eliminarUsuario(usuarioSeleccionado.id);
            setUsuarios(prevUsuarios =>
                prevUsuarios.filter(usuario => usuario.id !== usuarioSeleccionado.id) 
            )
            toast.success("Usuario eliminado correctamente");
            cerrarModal();
        } catch {
            toast.error("Ocurrió un error al eliminar el usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
          isOpenModal={true}
          setIsOpenModal={cerrarModal}
          title="Eliminar usuario"
          description="Esta acción eliminará permanentemente al usuario de la plataforma."
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p className="mb-2">
                    Para confirmar la eliminación, escribe el nombre del usuario <b>{usuarioSeleccionado?.primerNombre} {usuarioSeleccionado?.apellidos}</b> en el campo a continuación:
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
                        textButton="Eliminar usuario"
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
      );
      
};

export default ModalEliminarUsuario;    