import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

const ModalCrearUsuario = (props) => {
    const {isOpenModal, setIsOpenModal} = props

    return (
        <Modal
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
            title="Crear Usuario"
            size="xl"
        >
            <form action="">
                <div className='custom-scrollbar h-[450px] overflow-y-auto px-2'>
                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                        Información personal
                    </h5>
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Primer nombre */}
                        <div>
                            <label htmlFor="" className='label-form'>
                                Primer nombre
                            </label>
                            <input type="text" className='input-form'/>
                            {/* <p className="input-message-error">Debe escribir un nombre</p> */}
                        </div>

                        {/* Apellidos */}
                        <div>
                            <label htmlFor="" className='label-form'>
                                Apellidos
                            </label>
                            <input type="text" className='input-form'/>
                            {/* <p className="input-message-error">Debe escribir un nombre</p> */}
                        </div>

                        {/* E-mail */}
                        <div>
                            <label htmlFor="" className='label-form'>
                                E-mail
                            </label>
                            <input type="text" className='input-form'/>
                            {/* <p className="input-message-error">Debe escribir un nombre</p> */}
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="" className='label-form'>
                                Username
                            </label>
                            <input type="text" className='input-form'/>
                            {/* <p className="input-message-error">Debe escribir un nombre</p> */}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="" className='label-form'>
                                Password
                            </label>
                            <input type="password" className='input-form'/>
                            {/* <p className="input-message-error">Debe escribir un nombre</p> */}
                        </div>

                    </div>

                    <h5 className="mt-5 mb-2 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                        Privilegios
                    </h5>
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Rol */}
                        <div>
                            <label htmlFor="" className='label-form'>
                                Rol
                            </label>
                            <select name="" id="" className='input-form'>
                                <option value="admin">Administrador</option>
                                <option value="editor">Editor</option>
                                <option value="viewer" selected>Lector</option>
                            </select>
                            {/* <p className="input-message-error">Debe escribir un nombre</p> */}
                        </div>
                    </div>
                </div>
                <div className='mt-4 flex justify-end gap-2'>
                    <Button 
                        colorButton={`secondary`}
                        textButton={`Cerrar`}
                        type= "button"
                    />
                    <Button 
                        colorButton={`primary`}
                        textButton={`Guardar cambios`}
                        type= "button"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ModalCrearUsuario;