import { LuEye, LuEyeOff, LuMoon, LuSun } from "react-icons/lu"
import { useDarkMode } from "../../shared/hooks/useDarkMode"
import { signUpService } from "../services/signupService"
import { handleErrors } from "../../utils/handleErrors"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import Button from "../../shared/components/Button"
import { login } from "../../store/authSlice"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const SignupPage = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm({ mode: "onChange"});
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [ messageError, setMessageError] = useState(null);
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        const dark = localStorage.getItem("dark")
        if (dark === "dark") {
          document.body.classList.add("dark")
        }
    }, []);

    // Redirecciona en caso de que el usuario este logueado
    useEffect(() => {
        if (isAuthenticated) {
          navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="relative flex flex-col justify-center w-full h-screen bg-white dark:bg-gray-900 sm:p-0 lg:flex-row">
            <div className="flex flex-col flex-1 w-full lg:w-1/2">
                <div className="flex flex-col p-4 justify-center flex-1 w-full max-w-md mx-auto">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 text-3xl">Registrarse</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Crea una cuenta ingresando tu nombre de usuario, correo y una contraseña segura.</p>

                    {/* Formulario para iniciar sesión */}
                    <form action="" className="gap-2 mt-6 text-sm text-gray-600 dark:text-white" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <div className="lg:flex gap-2">
                            {/* Primer nombre */}
                            <div>
                                <label htmlFor="primerNombre" className="font-semibold">Primer nombre <span className="text-red-600">*</span></label>
                                <input type="text" 
                                    className={`${(errors.primerNombre && errors.primerNombre.message) ? "input-form-error": ""} input-form`}
                                    {...register("primerNombre", {
                                            required: {value: true, message:"Debe escribir un nombre."}, 
                                            minLength: {value: 2, message: "El nombre debe tener al menos dos caracteres."},
                                            maxLength: {value: 30, message: "El nombre no puede tener más de 30 caracteres."}
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
                                    className={`${(errors.apellidos && errors.apellidos.message) ? "input-form-error": ""} input-form`}
                                    type="text"
                                    {...register("apellidos", {
                                        required: {value: true, message:"Debe escribir los apellidos."}, 
                                        minLength: {value: 2, message: "Los apellidos deben tener al menos dos caracteres."},
                                        maxLength: {value: 60, message: "Los apellidos no pueden tener más de 60 caracteres."}
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
                                className={`${errors.email ? "input-form-error": ""} input-form`}
                                {...register("email", {
                                    required: {value: true, message: "Debe escribir correo electrónico"}, 
                                    pattern: {
                                        value: /^(?!\.)[a-zA-Z0-9._%+-]+@(?!-)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Escriba un correo electrónico válido."
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
                                className={`${errors.username ? "input-form-error": ""} input-form`}
                                type="text" 
                                id="username"
                                {...register("username", {
                                    required: {value: true, message: "El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos."}, 
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]{3,20}$/,
                                        message: "El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos."
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
                                    className={`${errors.password ? "input-form-error": ""} input-form`}
                                    type={mostrarPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: {value: true, message: "La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud."},
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;""<>,.?\\/]).{8,20}$/,
                                            message: "La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud."
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

                        {messageError && 
                            <p className="message-error">
                                {messageError}
                            </p>
                        }
                        <Button type="submit" loading={loading} className="my-3" colorButton="primary" textButton="Registrarse"/>
                        <p className="text-sm text-gray-600 dark:text-white">¿Ya tienes una cuenta creada? <Link to="/login" className="text-indigo-700 dark:text-white underline">Loguéate aquí</Link></p>
                    </form>
                </div>
            </div>
            <div className="relative items-center hidden w-full h-full bg-blue-900 dark:bg-white/5 lg:grid lg:w-1/2">
                <div className="absolute right-0 top-0 w-full max-w-[250px] xl:max-w-[450px]">
                    <img src="/src/assets/images/shape/grid-01.svg" alt="grid" className="z-200" />
                </div>
                <div className="absolute bottom-0 left-0 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
                    <img src="src/assets/images/shape/grid-01.svg" alt="grid" />
                </div>
                <div>
                    <h1 className="text-center text-6xl text-white font-semibold">Kardex</h1>
                    <p className="text-center text-gray-400 dark:text-white/60">De medicamentos, insumos y dispositivos médicos.</p>
                </div>
            </div>
            <button
                onClick={toggleDarkMode}
                className="absolute left-10 bottom-10 w-10 h-10 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200  cursor-pointer"
            >
                {darkMode ? <LuMoon /> : <LuSun />}
            </button>
        </div>
    )
}
export default SignupPage