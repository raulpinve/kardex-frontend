import { useDarkMode } from "../../shared/hooks/useDarkMode"
import { loginService } from "../services/loginService"
import { handleErrors } from "../../utils/handleErrors"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import Button from "../../shared/components/Button"
import { LuMoon, LuSun } from "react-icons/lu"
import { login } from "../../store/authSlice"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const LoginPage = () => {
    const { register, handleSubmit, setError, formState: { errors }, setValue } = useForm({ mode: "onChange" });
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [ messageError, setMessageError ] = useState(null);
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [ loading, setLoading ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate])

    const onSubmit = async (data) => {
        setMessageError(false)
        setLoading(true)
        try {
            const resultado = await loginService(data)
            if(resultado.data.token){
                localStorage.setItem("token", resultado.data.token)
                dispatch(login(resultado.data))
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
        } finally {
            setLoading(false)
        }
    }

    // Establece el modo nocturno en caso de que este activado
    useEffect(() => {
        const sidebarMode = localStorage.getItem("sidebarMode")
        if (sidebarMode === "dark") {
            document.body.classList.add("dark")
        }
    }, []);

    return (
        <div className="relative flex flex-col justify-center w-full h-screen bg-white dark:bg-gray-900 sm:p-0 lg:flex-row">
            <div className="flex flex-col flex-1 w-full lg:w-1/2">
                <div className="flex flex-col p-4 justify-center flex-1 w-full max-w-md mx-auto">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 text-3xl">Iniciar sesión</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ingresa tu nombre de usuario y contraseña para iniciar sesión</p>

                    {/* Formulario para iniciar sesión */}
                    <form
                        action=""
                        className="flex flex-col gap-2 text-sm text-gray-600 dark:text-white mt-6"
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete="off"
                    >
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="font-semibold">
                            Username <span className="text-red-600">*</span>
                            </label>
                            <input
                                className={`${ errors.username ? "input-form-error" : ""} input-form`}
                                type="text"
                                id="username"
                                {...register("username", {
                                    required: {
                                        value: true,
                                        message: "El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.",
                                    },
                                    pattern: {
                                    value: /^[a-zA-Z0-9_]{3,20}$/,
                                    message: "El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.",
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
                                className={`${ errors.password ? "input-form-error" : ""}  input-form`}
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message:"La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.",
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;""<>,.?\\/]).{8,20}$/,
                                        message: "La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.",
                                    },
                                })}
                            />
                            {errors.password && errors.password.message && (
                                <p className="input-message-error">{errors.password.message}</p>
                            )}
                        </div>
                        {/* Mensaje de error general */}
                        {messageError && <p className="message-error">{messageError}</p>}

                        <Link to="/solicitar-restablecer-contrasena" className="text-indigo-700 underline dark:text-white">
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
            <div className="relative items-center hidden w-full h-full bg-blue-900 dark:bg-white/5 lg:grid lg:w-1/2">
                <div className="absolute right-0 top-0 w-full max-w-[250px] xl:max-w-[450px]">
                    <img src="/images/shape/grid-01.svg" alt="grid" className="z-200" />
                </div>
                <div className="absolute bottom-0 left-0 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
                    <img src="/images/shape/grid-01.svg" alt="grid" />
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

export default LoginPage