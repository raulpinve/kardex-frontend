import React, { useEffect, useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import { crearUsuario } from "../../services/usuarioService";
import { handleErrors } from "../../../../utils/handleErrors";
import MessageError from "../../../../shared/components/MessageError";
import { LuChevronDown, LuEye, LuEyeOff } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ModalCrearUsuario = (props) => {
    const {cerrarModal, setUsuarios} = props;
    const [messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({ mode: "onChange" })

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const result = await crearUsuario(values)
            const data = result?.data
            if(data){
                setUsuarios(prevUsuarios => [data, ...prevUsuarios]);
                cerrarModal()
                setValue("primerNombre", "")
                setValue("apellidos", "")
                setValue("email", "")
                setValue("username", "")
                setValue("password", "")  
            } 
            toast.success('Usuario creado correctamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        setValue("rol", "");
    }, [setValue])
    
    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Crear Usuario"
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <h5 className="text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Información personal
                </h5>
                <div className="grid sm:grid-cols-2 gap-2">
                    {/* Primer nombre */}
                    <div>
                        <label htmlFor="primerNombre" className="label-form">
                            Primer nombre <span className="input-required">*</span>
                        </label>
                        <input 
                            className={`${errors.primerNombre ? "input-form-error" : ""} input-form`}
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
                        {errors.primerNombre && (<p className="input-message-error">{errors.primerNombre.message}</p>)} 
                    </div>

                    {/* Apellidos */}
                    <div>
                        <label htmlFor="apellidos" className="label-form">
                            Apellidos <span className="input-required">*</span>
                        </label>
                        <input 
                            type="text" 
                            className={`${errors.apellidos ? "input-form-error": ""} input-form`}
                            {...register("apellidos", {
                                required: {value: true, message:"Debe escribir los apellidos."}, 
                                minLength: {value: 2, message: "Los apellidos deben tener al menos dos caracteres."},
                                maxLength: {value: 60, message: "Los apellidos no pueden tener más de 60 caracteres."}
                            })}
                            id="apellidos"
                            placeholder="Ej: Pérez Martinez"
                        />
                        {errors.apellidos && (<p className="input-message-error">{errors.apellidos.message}</p>)} 
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
                        {errors.email && (<p className="input-message-error">{errors.email.message}</p>)} 
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
                    
                    {/* Contraseña */}
                    <div>
                        <label htmlFor="password" className="font-semibold">Contraseña <span className="text-red-600">*</span></label>
                        <div className="relative">
                            <input 
                                className={`${errors.password ? "input-form-error": ""} input-form`}
                                type={mostrarPassword ? "text" : "password"}
                                {...register("password", {
                                    required: {value: true, message: 'La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.'},
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?\\/]).{8,20}$/,
                                        message: 'La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.'
                                    }
                                })}
                            />
                            <button 
                                className="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                                type="button"    
                                onClick={() => setMostrarPassword(prev => !prev)}
                            >
                                {mostrarPassword ? <LuEyeOff /> : <LuEye />}
                            </button>
                        </div>
                        {(errors.password && errors.password.message ) && (
                            <p className="input-message-error">{errors.password.message}</p>
                        )}
                    </div>
                </div>

                <h5 className="my-5 mb-1 text-lg font-medium text-gray-800 dark:text-white/90 ">
                    Privilegios
                </h5>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Rol */}
                    <div>
                        <label htmlFor="rol" className="label-form"> Rol </label>
                        <div className="relative">
                            <LuChevronDown  className="absolute right-3.5 top-[13px] dark:text-gray-200" />                     
                            <select 
                                id="rol" 
                                className={`${ errors.rol ? 'input-form-error' : ''} select-form`}
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

export default ModalCrearUsuario;