import MessageError from "../../../../shared/components/MessageError";
import { handleErrors } from "../../../../utils/handleErrors";
import { editarUsuario } from "../../services/usuarioService";
import Button from "../../../../shared/components/Button";
import Modal from "../../../../shared/components/Modal";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { LuChevronDown } from "react-icons/lu";

const ModalEditarUsuario = (props) => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({ mode: "onChange"})
    const {cerrarModal, setUsuarios, usuarioSeleccionado} = props;
    const [messageError, setMessageError] = useState(false);
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(false);

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const result = await editarUsuario(token, usuarioSeleccionado.id, values)
            const data = result?.data
            if(data){
                setUsuarios(prevUsuarios =>
                    prevUsuarios.map(usuario => {
                        return usuario.id === data.id ? { ...usuario, ...data } : usuario
                    })
                );
                cerrarModal()
                setValue("primerNombre", "")
                setValue("apellidos", "")
                setValue("username", "")
                setValue("password", "")  
            } 
            toast.success('Usuario editado correctamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if(usuarioSeleccionado){
            setValue("primerNombre", usuarioSeleccionado.primerNombre);
            setValue("apellidos", usuarioSeleccionado.apellidos);
            setValue("username", usuarioSeleccionado.username);
            setValue("rol", usuarioSeleccionado.rol);
        }
    }, [usuarioSeleccionado, setValue])

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Editar Usuario"
            description="Edita un usuario con los permisos necesarios para acceder a la aplicación."
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <h5 className="text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Información personal
                </h5>
                <div className="grid md:grid-cols-2 gap-2">
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
                                    message: "Debe proporcionar un nombre para el usuario.",
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

                <h5 className="my-5 mb-1 text-lg font-medium text-gray-800 dark:text-white/90 ">
                    Privilegios
                </h5>
                <div className="grid grid-cols-2 gap-4">
                    {/* Rol */}
                    <div>
                        <label htmlFor="" className="label-form">
                            Rol
                        </label>
                        <div className="relative">
                            <LuChevronDown className="absolute right-3.5 top-[13px] dark:text-gray-200" />                     
                            <select 
                                id="rol" 
                                className={`${ errors.rol ? 'input-form-error' : ''}  input-form`}
                                {...register("rol", {
                                    required: "El rol es obligatorio",
                                    validate: value => ["admin", "editor", "viewer"].includes(value) || "Rol inválido"
                                })}
                            >
                                <option value="" disabled>Seleccionar...</option>
                                <option value="admin">Administrador</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Lector</option>
                            </select>
                        </div>
                        {errors.rol && (<p className="input-message-error">{errors.rol.message}</p>)}
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

export default ModalEditarUsuario;