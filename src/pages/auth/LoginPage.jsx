import { useEffect, useState } from 'react'
import Button from '../../shared/components/Button'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginService } from '../services/loginService'
import { login } from '../../store/authSlice'
import { handleErrors } from '../../utils/handleErrors'
import { RiLoader4Fill } from 'react-icons/ri'

const LoginPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ loading, setLoading ] = useState(false)
    const [ messageError, setMessageError ] = useState(null)
    const { isAuthenticated } = useSelector((state) => state.auth)
    const { register, handleSubmit, setError, formState: { errors }, setValue } = useForm({
        mode: "onChange"
    })
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate])

    const onSubmit = async (data) => {
        setMessageError(false)
        setLoading(true)
        try {
          const resultado = await loginService(data)
          if(resultado.data.token){
            dispatch(login(resultado.data))
            localStorage.setItem("token", resultado.data.token)
            navigate('/')
          }else{
            throw "errorInterno"
          }
        } catch (error) {
          if(error === "errorInterno"){
            setMessageError("Ha ocurrido un error interno. Por favor, inténtalo nuevamente.")
          }else{
            handleErrors(error, setError, setMessageError)
          }
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

    useEffect(() => {
        setValue("username", "raulpinve");
        setValue("password", "Bogota123@");
      }, [])

    return (
        <div className='w-screen h-screen bg-slate-100 dark:bg-slate-900 px-6 flex items-center'>
            <div className='bg-white dark:bg-slate-800 dark:text-white p-8 w-full md:w-[400px] rounded-xl mx-auto border-lg shadow '>
                {/* Logotipo */}
                <div className="text-center py-2 w-full">
                    <h1 className="uppercase text-3xl font-bold tracking-[4px]">Kardex</h1>
                    <p className="text-center text-gray-500 text-sm">De medicamentos, insumos y dispositivos médicos.</p>
                </div>
                <h3 className="mt-3 mb-1 text-xs uppercase leading-[20px] text-gray-400 text-left">
                    <p>Iniciar sesión</p>
                </h3>

                {/* Formulario para iniciar sesión */}
                <form
                    action=""
                    className="flex flex-col gap-4 text-sm text-gray-600 dark:text-white mt-6"
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
                        
                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="font-semibold">
                        Contraseña <span className="text-red-600">*</span>
                        </label>
                        <input
                            className={`${ errors.password ? 'input-form-error' : ''}  input-form`}
                            type="password"
                            id="password"
                            {...register('password', {
                                required: {
                                    value: true,
                                    message:'La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.',
                                },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?\\/]).{8,20}$/,
                                    message: 'La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.',
                                },
                            })}
                        />
                        {errors.password && errors.password.message && (
                            <p className="input-message-error">{errors.password.message}</p>
                        )}
                    </div>
                    {/* Mensaje de error general */}
                    {messageError && <p className="message-error">{messageError}</p>}

                    <Link to="/app/solicitar-restablecer-contrasena" className="text-indigo-700 underline dark:text-white">
                        ¿Olvidó su contraseña?
                    </Link>
                    
                    <Button
                        type="submit"
                        loading={loading}
                        colorButton="primary"
                        textButton="Iniciar sesión"
                    />
                        <p className="text-sm text-gray-600 dark:text-white">
                    </p>
                                        
                    <p className="text-sm text-gray-600 dark:text-white">
                        ¿Aún no tienes una cuenta? {" "}
                        <Link to="/signup" className="text-indigo-700 underline dark:text-white">
                            Registrate aquí
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default LoginPage