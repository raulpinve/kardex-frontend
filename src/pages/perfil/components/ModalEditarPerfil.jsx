import React, { useEffect, useState } from 'react';
import Modal from '../../../shared/components/Modal';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/Button';
import MessageError from '../../../shared/components/MessageError';
import { toast } from 'sonner';
import { handleErrors } from '../../../utils/handleErrors';
import { actualizarPerfil } from '../services/perfilService';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../store/authSlice';

const ModalEditarPerfil = (props) => {
    const {cerrarModal} = props;
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const token = useSelector(state => state.auth.token);
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({ 
        mode: "onChange"
    })
    const dispatch = useDispatch();
    const usuario = useSelector(state => state.auth.usuario);

    useEffect(() => {
        if(usuario){
            setValue("primerNombre", usuario.primerNombre);
            setValue("apellidos", usuario.apellidos);
            setValue("email", usuario.email);
            setValue("username", usuario.username);
        }
    }, [usuario])

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const result = await actualizarPerfil(token, values)
            const data = result?.data
            if(data){
                cerrarModal()
                setValue("primerNombre", "")
                setValue("apellidos", "")
                setValue("email", "")
                setValue("username", "")
                dispatch(updateUser(data));
                localStorage.setItem("token", data.token)
            } 
            toast.success('Perfil editado correctamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Editar perfil"
            description="Actualiza la información de tu cuenta, como tu nombre, usuario y correo electrónico."
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Primer nombre */}
                    <div>
                        <label htmlFor="primerNombre" className="label-form">
                            Primer nombre <span className="input-required">*</span>
                        </label>
                        <input 
                            className={`${errors.primerNombre && errors.primerNombre.message ? "input-form-error" : ""} input-form`}
                            {...register("primerNombre", {
                                required: {
                                    value: true,
                                    message: "Debe proporcionar un nombre.",
                                },
                                minLength: {
                                    value: 2,
                                    message: "El nombre debe tener al menos dos caracteres.",
                                },
                                maxLength: {
                                    value: 100,
                                    message: "El nombre no debe exceder los 100 caracteres.",
                                },
                            })}
                            id="primerNombre"
                        />
                        {errors.primerNombre && errors.primerNombre.message && (<p className="input-message-error">{errors.primerNombre.message}</p>)} 
                    </div>

                    {/* Apellidos */}
                    <div>
                        <label htmlFor="apellidos" className="label-form">
                            Apellidos <span className="input-required">*</span>
                        </label>
                        <input 
                            type="text" 
                            className={`${(errors.apellidos && errors.apellidos.message) ? "input-form-error": ""} input-form`}
                            {...register("apellidos", {
                                required: {value: true, message:"Debe escribir los apellidos."}, 
                                minLength: {value: 2, message: "Los apellidos deben tener al menos dos caracteres."},
                                maxLength: {value: 60, message: "Los apellidos no pueden tener más de 60 caracteres."}
                            })}
                            id="apellidos"
                            placeholder="Ej: Pérez Martinez"
                        />
                        {errors.apellidos && errors.apellidos.message && (<p className="input-message-error">{errors.apellidos.message}</p>)} 
                    </div>
                    
                    {/* E-mail */}
                    <div>
                        <label htmlFor="email" className="label-form">
                            E-mail <span className="input-required">*</span>
                        </label>
                        <input 
                            className={`${errors.email ? "input-form-error": ""} input-form`}
                            {...register("email", {
                                required: {value: true, message: 'Debe escribir correo electrónico'}, 
                                pattern: {
                                    value: /^(?!\.)[a-zA-Z0-9._%+-]+@(?!-)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Escriba un correo electrónico válido.'
                                }
                            })}
                            type="email" 
                            id="email"
                            placeholder='pepitoperez@gmail.com'
                        />
                        {errors.email && errors.email.message && (<p className="input-message-error">{errors.email.message}</p>)} 
                    </div>

                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="label-form">
                            Username <span className="input-required">*</span>
                        </label>
                        <input 
                            type="text" 
                            className={`${errors.username ? "input-form-error": ""} input-form`}
                            {...register("username", {
                                required: {value: true, message: 'El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.'}, 
                                pattern: {
                                    value: /^[a-zA-Z0-9_]{3,20}$/,
                                    message: 'El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.'
                                }
                            })}
                        />
                        {errors.username && (<p className="input-message-error">{errors.username.message}</p>)}
                    </div>
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

export default ModalEditarPerfil;