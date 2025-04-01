import { restablecerContrasena } from "../services/restablecerContrasenaService"
import { handleErrors } from "../../utils/handleErrors"
import Button from "../../shared/components/Button"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const RestablecerContrasena = () => {
    const {token} = useParams()
    const [ loading, setLoading ] = useState(false)
    const [ messageError, setMessageError ] = useState(null)
    const { register, handleSubmit, setError, formState: { errors }, watch } = useForm({ mode: "onChange"})
    const [contrasenaRestablecida, setContrasenaRestablecida] = useState(false);

    const onSubmit = async (values) => {
        setMessageError(false)
        setLoading(true)
        const data = {
            ...values, 
            token
        }
        try {
            await restablecerContrasena(token, data)
            setContrasenaRestablecida(true)
        } catch (error) {
            handleErrors(error, setError, setMessageError)
        } finally {
          setLoading(false)
        }
    }

    // Establece el modo nocturno en caso de que este activado
    useEffect(() => {
        const sidebarMode = localStorage.getItem('sidebarMode')
        if (sidebarMode === 'dark') {
            document.body.classList.add('dark')
        }
    }, []);

    // Obtener el valor del campo de contraseña
    const password = watch('password')

    return (
        <div className='w-screen h-screen bg-slate-100 dark:bg-slate-900 px-6 flex items-center'>
                <div className='bg-white dark:bg-slate-800 dark:text-white p-8 w-full md:w-[400px] rounded-xl mx-auto border-lg shadow '>
                    <div className="text-center py-2 w-full">
                        <h1 className="uppercase text-3xl font-bold tracking-[4px]">Kardex</h1>
                        <p className="text-center text-gray-500 text-sm">De medicamentos, insumos y dispositivos médicos.</p>
                    </div>
                    <h3 className="mt-3 mb-1 text-xs uppercase leading-[20px] text-gray-400 text-left">
                        <p>Restablecer contraseña</p>
                    </h3>
                    {contrasenaRestablecida ? (<>
                        <p className='mt-3 text-success'>✅ ¡Contraseña actualizada con éxito! Por favor, inicia sesión utilizando tus nuevas credenciales.</p>
                        <Link
                            to={`/login`}
                            className="button-form button-form-primary mt-3"
                        >
                            Inicia sesión aquí
                        </Link>
                    </>
                    ):(
                        <form
                            action=""
                            className="flex flex-col gap-4 text-sm text-gray-600 dark:text-white mt-6"
                            onSubmit={handleSubmit(onSubmit)}
                            autoComplete='off'
                        >
                            {/* Nueva contraseña */}
                            <div>
                                <label htmlFor="password" className='label-form'>Nueva contraseña <span className='text-red-600'>*</span></label>
                                <input
                                    id='password'
                                    type='password'
                                    className={`${errors.password && "input-form-error"} input-form`}
                                    {...register('password', {
                                            required: {
                                                value: true,
                                                message: 'Debe proporcionar una nueva contraseña.',
                                            },
                                            pattern: {
                                                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-\={}[\]:;\"'<>,.?\\/]).{8,20}$/, 
                                                message: 'La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.'
                                            }
                                        })
                                    }
                                />
                                {errors.password && errors.password.message && (
                                    <p className="text-red-600">{errors.password.message}</p>
                                )}
                            </div>
                            
                            {/* Repetir contraseña */}
                            <div>
                                <label htmlFor="repeatpassword" className='label-form'>Repetir contraseña <span className='text-red-600'>*</span></label>
                                <input
                                    id='repeatpassword'
                                    type='password'
                                    className={`${errors.repeatpassword && "input-form-error"} input-form`}
                                    {...register('repeatpassword', {
                                            required: {
                                                value: true,
                                                message: 'Debe volver a escribir la nueva contraseña',
                                            },
                                            validate: (value) =>
                                                value === password || "Las contraseñas no coinciden."
                                        })
                                    }
                                />
                                {errors.repeatpassword && errors.repeatpassword.message && (
                                    <p className="text-red-600">{errors.repeatpassword.message}</p>
                                )}
                            </div>
                        
                            {/* Mensaje de error general */}
                            {messageError && <p className="message-error">{messageError}</p>}
    
                            <Button
                                type="submit"
                                loading={loading}
                                colorButton="primary"
                                textButton="Restablecer contraseña"
                            />
                        </form>
                    )}
                    
                </div>
            </div>
    )
}

export default RestablecerContrasena
