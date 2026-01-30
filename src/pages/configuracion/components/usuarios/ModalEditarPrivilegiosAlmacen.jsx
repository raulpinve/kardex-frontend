import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import Button from '../../../../shared/components/Button';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import { obtenerAlmacenes } from '../../services/almacenService';
import { obtenerPrivilegiosUsuario } from '../../services/usuarioService';
import { actualizarPrivilegiosUsuario } from '../../services/usuarioService';
import { handleErrorsBasic } from '../../../../utils/handleErrors';

const ModalEditarPrivilegiosAlmacen = (props) => {
    const {cerrarModal, usuarioSeleccionado, setUsuarioSeleccionado} = props;
    const [almacenes, setAlmacenes] = useState([]);
    const [almacenesSeleccionados, setAlmacenesSeleccionados] = useState([]);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [messageError,setMessageError] = useState(null);

    useEffect(() => {
        const cargarAlmacenesPrivilegios = async () => {
            setLoadingFetch(true);
            try {
                const [resAlmacenes, resPrivilegios] = await Promise.all([
                    obtenerAlmacenes(),
                    obtenerPrivilegiosUsuario(usuarioSeleccionado.id + "f"),
                ]);
        
                setAlmacenes(resAlmacenes?.data || []);
                setAlmacenesSeleccionados(resPrivilegios?.data || []);
            } catch {
                toast.error("Ha ocurrido un error al momento de obtener los privilegios del usuario.");
                setUsuarioSeleccionado(null);
                cerrarModal();
            } finally {
                setLoadingFetch(false);
            }
        };
      
        if (usuarioSeleccionado) {
          cargarAlmacenesPrivilegios();
        }
    }, [usuarioSeleccionado, cerrarModal, setUsuarioSeleccionado]);

    const guardarCambios = async() => {
        setMessageError(null)
        setLoadingSave(true)
        try {
            await actualizarPrivilegiosUsuario(usuarioSeleccionado.id, {
                almacenesIds: almacenesSeleccionados
            })
            toast.success('Privilegios actualizados correctamente.');
            cerrarModal(false)
        } catch (error) {
            handleErrorsBasic(error, setMessageError);
        } finally{

            setLoadingSave(false)
        }
    }
    
    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Editar privilegios"
            size="md"
        >
            <form>
                {almacenes.length === 0 && !loadingFetch && <p className='text-center text-sm'>No hay almacenes creados</p>}
                {loadingFetch && (<>
                    {[...Array(5)].map((_, i) => (
                        <div className='flex gap-2 mb-2' key={i}>
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded w-7 h-5"></div>
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded w-30 h-5"></div>
                        </div>
                    ))}
                </>)}
                {!loadingSave && messageError && 
                    <MessageError>
                        {messageError}
                    </MessageError>
                }
                {!loadingFetch && almacenes.length > 0 && (<>
                    <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                        Almacenes
                    </h5>
                    {
                        almacenes.map((almacen) => (
                            <div key={almacen.id}>
                                <label htmlFor={`almacen-${almacen.id}`} className="flex cursor-pointer items-center text-sm  text-gray-700 select-none dark:text-gray-400">
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            id={`almacen-${almacen.id}`}  
                                            className="hover:border-brand-500 dark:hover:border-brand-500 mr-2 flex h-4 w-4 items-center justify-center rounded-md border-[1.25px] border-brand-500 bg-brand-500" 
                                            checked={almacenesSeleccionados.includes(almacen.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAlmacenesSeleccionados([...almacenesSeleccionados, almacen.id]);
                                                } else {
                                                    setAlmacenesSeleccionados(almacenesSeleccionados.filter(id => id !== almacen.id));
                                                }
                                            }}
                                        />
                                    </div>
                                    {almacen.nombre}
                                </label>
                            </div>
                        ))
                    }
                     <div className="mt-4 flex justify-end gap-2">
                        <Button 
                            colorButton={`secondary`}
                            textButton={`Cerrar`}
                            type= "button"
                            onClick={() => {
                                cerrarModal(false);
                            }}
                        />
                        <Button 
                            colorButton={`primary`}
                            textButton={`Guardar cambios`}
                            loading={loadingSave || loadingFetch} disabled={loadingFetch}
                            type= "button"
                            onClick={guardarCambios}
                        />
                    </div>
                </>)}
            </form>
        </Modal>
    );
};

export default ModalEditarPrivilegiosAlmacen;