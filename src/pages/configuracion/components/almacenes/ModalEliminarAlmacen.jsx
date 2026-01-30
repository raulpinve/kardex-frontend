import MessageError from '../../../../shared/components/MessageError';
import { eliminarAlmacen } from '../../services/almacenService';
import Button from '../../../../shared/components/Button';
import Modal from '../../../../shared/components/Modal';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setAlmacen } from '@/store/almacenSlice';

const ModalEliminarAlmacen = (props) => {
    const {cerrarModal, almacenSeleccionado, setAlmacenes} = props;
    const [messageError, setMessageError] = useState();
    const [loading, setLoading] = useState();
    const [inputNombre, setInputNombre] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inputNombre.trim() !== "eliminar almacén") {
            setMessageError('El texto ingresado no coincide con "eliminar almacén".');
            return;
        }

        setMessageError("");
        setLoading(true);

        try {
            await eliminarAlmacen(almacenSeleccionado.id);
            setAlmacenes(prevAlmacenes =>
                prevAlmacenes.filter(almacen => almacen.id !== almacenSeleccionado.id) 
            )
            dispatch(setAlmacen(null));
            toast.success("Almacén eliminado exitosamente");
            cerrarModal();
        } catch {
            toast.error("Ocurrió un error al eliminar el almacén");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
          isOpenModal={true}
          setIsOpenModal={cerrarModal}
          title="Eliminar almacén"
          size="md"
        >
            <form onSubmit={handleSubmit}>
                <p>Para confirmar la eliminación, escribe <strong>“eliminar almacén”</strong> en el campo a continuación.</p>
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
                        textButton="Eliminar almacén"
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
      );
      
};

export default ModalEliminarAlmacen;    