import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import Button from '../../../../shared/components/Button';
import Modal from '../../../../shared/components/Modal';
import MessageError from '../../../../shared/components/MessageError';
import { obtenerAlmacenes } from '../../services/almacenService';
import { useSelector } from 'react-redux';
import { obtenerPrivilegiosUsuario } from '../../services/usuarioService';
import { actualizarPrivilegiosUsuario } from '../../services/usuarioService';
import { handleErrorsBasic } from '../../../../utils/handleErrors';

const ModalEditarPrivilegiosAlmacen = (props) => {
    const {cerrarModal, usuarioSeleccionado, setUsuarioSeleccionado} = props;
    const [almacenes, setAlmacenes] = useState([]);
    const [almacenesSeleccionados, setAlmacenesSeleccionados] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state.auth.token);
    const [messageError,setMessageError] = useState(null);
    const [messageErrorCargarData, setMessageErrorCargarData] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoadingData(true);
            setMessageErrorCargarData(null);
            try {
                const [resAlmacenes, resPrivilegios] = await Promise.all([
                    obtenerAlmacenes(token),
                    obtenerPrivilegiosUsuario(token, usuarioSeleccionado.id),
                ]);
        
                setAlmacenes(resAlmacenes?.data || []);
                setAlmacenesSeleccionados(resPrivilegios?.data || []);
            } catch {
                toast.error("Ha ocurrido un error al momento de obtener los privilegios del usuario.");
                cerrarModal();
                setUsuarioSeleccionado(null);
            } finally {
                setLoadingData(false);
            }
        };
      
        if (usuarioSeleccionado) {
          cargarDatos();
        }
    }, [JSON.stringify(usuarioSeleccionado)]);

    const guardarCambios = async() => {
        setMessageError(false)
        setLoading(true)
        try {
            await actualizarPrivilegiosUsuario(token, usuarioSeleccionado.id, {
                almacenesIds: almacenesSeleccionados
            })
            toast.success('Privilegios actualizados correctamente.');
            cerrarModal(false)
        } catch (error) {
            handleErrorsBasic(error, setMessageError);
        } finally{
            setLoading(false)
        }
    }
    
    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Editar privilegios"
            description="Asigna al usuario los privilegios necesarios para acceder a los almacenes que elijas"
            size="ms"
        >
            <form action="">
                {almacenes.length === 0 ? <p className='text-center text-sm'>No hay almacenes creados</p>: <>
                    <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                        Almacenes
                    </h5>
                    {loadingData ? <>
                        {[...Array(5)].map((_, i) => (
                            <div className='flex gap-2 mb-2' key={i}>
                                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded w-5 h-5"></div>
                                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded w-25 h-5"></div>
                            </div>
                        ))}
                    </> : 
                        <>
                            { messageErrorCargarData ? <MessageError>
                                {messageErrorCargarData}
                            </MessageError>
                            : <> 
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
                            </> 
                        }
                        </>
                    }

                    {messageError && 
                        <MessageError>
                            {messageError}
                        </MessageError>
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
                            loading = {loading}
                            type= "button"
                            onClick={guardarCambios}
                        />
                    </div>
                </>}
            </form>
        </Modal>
    );
};

export default ModalEditarPrivilegiosAlmacen;