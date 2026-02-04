import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { handleErrors } from '../../utils/handleErrors'
import Button from '../../shared/components/Button'
import { solicitarRestablecer } from '../services/restablecerContrasenaService'

const SolicitarRestablecerContrasena = () => {
    const [ loading, setLoading ] = useState(false)
    const [ messageError, setMessageError ] = useState(null)
    const { register, handleSubmit, setError, formState: { errors }, setValue } = useForm({ mode: "onChange"})
    const [instruccionesEnviadas, setInstruccionesEnviadas] = useState(false);

    const onSubmit = async (data) => {
        setMessageError(false)
        setLoading(true)
        try {
            await solicitarRestablecer(data)
            setInstruccionesEnviadas(true);
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
    return (
        <div className='w-screen h-screen bg-slate-100 dark:bg-slate-900 px-6 flex items-center'>
            <div className='bg-white dark:bg-slate-800 dark:text-white p-8 w-full md:w-[400px] rounded-xl mx-auto border-lg shadow '>

                <div className="text-center py-2 w-full">
                    <h1 className="uppercase text-3xl font-bold tracking-[4px]">Kardex</h1>
                    <p className="text-center text-gray-500 text-sm">De medicamentos, insumos y dispositivos médicos.</p>
                </div>
                <h3 className="mt-3 mb-1 text-xs uppercase leading-[20px] text-gray-400 text-left">
                    <p>Recuperar contraseña</p>
                </h3>

                {instruccionesEnviadas ? (
                    <p className='mt-3'>✅ Hemos enviado instrucciones a su correo electrónico para restablecer su contraseña</p>
                ):(
                    <form
                        action=""
                        className="flex flex-col gap-4 text-sm text-gray-600 dark:text-white mt-2"
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete='off'
                    >
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="font-semibold">
                                Username <span className="text-red-600">*</span>
                            </label>
                            <input
                                className={`${ errors.username ? 'input-form-error' : ''} input-form`}
                                type="text"
                                id="username"
                                {...register('username', {
                                    required: {
                                        value: true,
                                        message:
                                            'El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.',
                                    },
                                    pattern: {
                                    value: /^[a-zA-Z0-9_]{3,20}$/,
                                    message:
                                        'El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.',
                                    },
                                })}
                            />
                            {errors.username && errors.username.message && (
                                <p className="input-message-error">{errors.username.message}</p>
                            )}
                        </div>
                        <p className='mt-2'>Ingresa el usuario que has registrado para enviarte las instrucciones de restablecimiento de contraseña a tu correo electrónico.</p>
                    
                        {/* Mensaje de error general */}
                        {messageError && <p className="message-error">{messageError}</p>}

                        <Button
                            type="submit"
                            loading={loading}
                            colorButton="primary"
                            textButton="Envíar instrucciones"
                        />
                    </form>
                )}
            </div>
        </div>
    )
}

export default SolicitarRestablecerContrasena