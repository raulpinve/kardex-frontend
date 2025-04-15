import React, { useEffect, useState } from 'react';
import { host } from '../../../utils/config';
import Modal from '../../../shared/components/Modal';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { handleErrors } from '../../../utils/handleErrors';
import MessageError from '../../../shared/components/MessageError';
import Button from '../../../shared/components/Button';
import { cambiarContrasena } from '../services/perfilService';
import { useSelector } from 'react-redux';

const ModalEditarContrasena = (props) => {
    const { register, handleSubmit, setError,getValues,formState: { errors },setValue } = useForm({ mode: "onChange" });
    const { cerrarModal } = props;
    const [messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state.auth.token);

    const onSubmit = async (values) => {
        setMessageError(false);
        setLoading(true);
        try {
            await cambiarContrasena(token, values);
            cerrarModal();
            toast.success('Contraseña actualizada correctamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Editar contraseña"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-5 mt-2">
                {/* Contraseña actual */}
                <div>
                    <label htmlFor="contrasenaActual" className="label-form">
                        Contraseña actual <span className="input-required">*</span>
                    </label>
                    <input 
                        type="password"
                        className={`input-form ${errors.contrasenaActual ? 'input-form-error' : ''}`}
                        {...register('contrasenaActual', {
                            required: 'Este campo es obligatorio.',
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?\\/]).{8,20}$/,
                                message: 'Debe tener al menos una mayúscula, un número, un carácter especial y entre 8-20 caracteres.',
                            },
                        })}
                    />
                    {errors.contrasenaActual && (
                        <p className="input-message-error">{errors.contrasenaActual.message}</p>
                    )}
                </div>

                {/* Nueva contraseña */}
                <div>
                    <label htmlFor="nuevaContrasena" className="label-form">
                        Nueva contraseña <span className="input-required">*</span>
                    </label>
                    <input 
                        type="password"
                        className={`input-form ${errors.nuevaContrasena ? 'input-form-error' : ''}`}
                        {...register('nuevaContrasena', {
                            required: 'Este campo es obligatorio.',
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?\\/]).{8,20}$/,
                                message: 'Debe tener al menos una mayúscula, un número, un carácter especial y entre 8-20 caracteres.',
                            },
                        })}
                    />
                    {errors.nuevaContrasena && (
                        <p className="input-message-error">{errors.nuevaContrasena.message}</p>
                    )}
                </div>

                {/* Repetir nueva contraseña */}
                <div>
                    <label htmlFor="repetirNuevaContrasena" className="label-form">
                        Repetir nueva contraseña <span className="input-required">*</span>
                    </label>
                    <input 
                        type="password"
                        className={`input-form ${errors.repetirNuevaContrasena ? 'input-form-error' : ''}`}
                        {...register('repetirNuevaContrasena', {
                            required: 'Este campo es obligatorio.',
                            validate: value =>
                                value === getValues('nuevaContrasena') || 'Las contraseñas no coinciden.',
                        })}
                    />
                    {errors.repetirNuevaContrasena && (
                        <p className="input-message-error">{errors.repetirNuevaContrasena.message}</p>
                    )}
                </div>
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
                        type= "submit"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ModalEditarContrasena;
