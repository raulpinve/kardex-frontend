import { Link, useNavigate } from "react-router-dom"
import { login } from "../../store/authSlice"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { signUpService } from "../services/signupService"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../shared/components/Button"
import { handleErrors } from "../../utils/handleErrors"
import { RiLoader4Fill } from "react-icons/ri"
import { LuEye, LuEyeOff } from "react-icons/lu"

const SignupPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, setError, formState: { errors }, setValue } = useForm({
        mode: "onChange"
    })
    const [ loading, setLoading ] = useState(false)
    const [ messageError, setMessageError] = useState(null)
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setMessageError(null);
        try {
            const resultado = await signUpService(data)
            if(resultado.data.token){
                dispatch(login(resultado.data));
                localStorage.setItem("token", resultado.data.token)
                navigate("/")
            }else{
                throw "errorInterno"
            }
        } catch (error) {
            if(error === "errorInterno"){
              setMessageError("Ha ocurrido un error interno. Por favor, inténtalo nuevamente.")
            }else{
              handleErrors(error, setError, setMessageError)
            }
        }finally{
          setLoading(false)
        }
    }

    // Establece el modo nocturno en caso de que este activado por el usuario
    useEffect(() => {
        const dark = localStorage.getItem('dark')
        if (dark === 'dark') {
          document.body.classList.add('dark')
        }
    }, []);

    // Redirecciona en caso de que el usuario este logueado
    useEffect(() => {
        if (isAuthenticated) {
          navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
      setValue("primerNombre", "Raul");
      setValue("apellidos", "Velásquez Pinto");
      setValue("email", "raulpinve@gmail.com");
      setValue("username", "raulpinve");
      setValue("password", "Bogota123@");
    }, [])

    return (
        <div className="relative flex flex-col justify-center w-full h-screen bg-white dark:bg-gray-900 sm:p-0 lg:flex-row">
            <div className="flex flex-col flex-1 w-full lg:w-1/2">
                <div className="flex flex-col p-4 justify-center flex-1 w-full max-w-md mx-auto">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 text-3xl">Registrarse</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Crea una cuenta ingresando tu nombre de usuario, correo y una contraseña segura.</p>

                    {/* Formulario para iniciar sesión */}
                    <form action="" className="flex flex-col gap-4 mt-6 text-sm text-gray-600 dark:text-white" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <div className="flex gap-2">
                            {/* Primer nombre */}
                            <div>
                                <label htmlFor="primerNombre" className="font-semibold">Primer nombre <span className="text-red-600">*</span></label>
                                <input type="text" 
                                    className={`${(errors.primerNombre && errors.primerNombre.message) ? "border-red-600": ""} input-form`}
                                    {...register("primerNombre", {
                                            required: {value: true, message:'Debe escribir un nombre.'}, 
                                            minLength: {value: 2, message: 'El nombre debe tener al menos dos caracteres.'},
                                            maxLength: {value: 30, message: 'El nombre no puede tener más de 30 caracteres.'}
                                        })
                                    }
                                    id="primerNombre"
                                />
                                {(errors.primerNombre && errors.primerNombre.message ) && (
                                    <p className="input-message-error">{errors.primerNombre.message}</p>
                                )}
                            </div>

                            {/* Apellidos */}
                            <div>
                                <label htmlFor="apellidos" className="font-semibold">Apellidos <span className="text-red-600">*</span></label>
                                <input
                                    className={`${(errors.apellidos && errors.apellidos.message) ? "border-red-600": ""} input-form`}
                                    type="text"
                                    {...register("apellidos", {
                                        required: {value: true, message:'Debe escribir los apellidos.'}, 
                                        minLength: {value: 2, message: 'Los apellidos deben tener al menos dos caracteres.'},
                                        maxLength: {value: 60, message: 'Los apellidos no pueden tener más de 60 caracteres.'}
                                    })}
                                    id="apellidos"
                                />
                                {(errors.apellidos && errors.apellidos.message ) && (
                                    <p className="input-message-error">{errors.apellidos.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="" className="font-semibold">E-mail <span className="text-red-600">*</span></label>
                            <input 
                                className={`${errors.email ? "border-red-600": ""} input-form`}
                                {...register("email", {
                                    required: {value: true, message: 'Debe escribir correo electrónico'}, 
                                    pattern: {
                                        value: /^(?!\.)[a-zA-Z0-9._%+-]+@(?!-)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Escriba un correo electrónico válido.'
                                    }
                                })}
                                type="email" 
                                id="email"
                            />
                            {(errors.email && errors.email.message ) && (
                                <p className="input-message-error">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="font-semibold">Username <span className="text-red-600">*</span></label>
                            <input 
                                className={`${errors.username ? "border-red-600": ""} input-form`}
                                type="text" 
                                id="username"
                                {...register("username", {
                                    required: {value: true, message: 'El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.'}, 
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]{3,20}$/,
                                        message: 'El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.'
                                    }
                                })}
                            />
                            {(errors.username && errors.username.message ) && (
                                <p className="input-message-error">{errors.username.message }</p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="font-semibold">Contraseña <span className="text-red-600">*</span></label>
                            <div className="relative">
                                <input 
                                    className={`${errors.password ? "border-red-600": ""} input-form`}
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
                                    className="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400 text-xl"
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

                        {messageError && 
                            <p className="message-error">
                                {messageError}
                            </p>
                        }
                        <Button type="submit" loading={loading} colorButton="primary" textButton="Registrarse"/>
                        <p className="text-sm text-gray-600 dark:text-white">¿Ya tienes una cuenta creada? <Link to="/login" className="text-indigo-700 dark:text-white underline">Loguéate aquí</Link></p>
                    </form>
                </div>
            </div>
            <div className="relative items-center hidden w-full h-full bg-blue-900 dark:bg-white/5 lg:grid lg:w-1/2">
                <div class="absolute right-0 top-0 w-full max-w-[250px] xl:max-w-[450px]">
                    <img src="/src/assets/images/shape/grid-01.svg" alt="grid" className="z-200" />
                </div>
                <div class="absolute bottom-0 left-0 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
                    <img src="src/assets/images/shape/grid-01.svg" alt="grid" />
                </div>
                <div>
                    <h1 className="text-center text-6xl text-white font-semibold">Kardex</h1>
                    <p className="text-center text-gray-400 dark:text-white/60">De medicamentos, insumos y dispositivos médicos.</p>
                </div>
            </div>
        </div>
    )
}
export default SignupPage