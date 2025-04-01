import { Link, useNavigate } from "react-router-dom"
import { login } from "../../store/authSlice"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { signUpService } from "../services/signupService"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../shared/components/Button"
import { handleErrors } from "../../utils/handleErrors"
import { RiLoader4Fill } from "react-icons/ri"

const SignupPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, setError, formState: { errors }, setValue } = useForm({
        mode: "onChange"
    })
    const [ loading, setLoading ] = useState(false)
    const [ messageError, setMessageError] = useState(null)
    const { isAuthenticated } = useSelector((state) => state.auth);

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
      <div className='h-screen bg-slate-100 dark:bg-slate-900 py-4 overflow-y-auto flex items-center dark:text-white'>
        {/* Signup */}
        <div className="bg-white dark:bg-slate-800 rounded-xl py-8 px-6 md:p-8 shadow-lg w-5/6 md:w-96 m-auto">

          {/* Logotipo */}
          <div className="text-center py-2 w-full">
              <h1 className="uppercase text-3xl font-bold tracking-[4px]">Kardex</h1>
              <p className="text-center text-gray-500 text-sm">De medicamentos, insumos y dispositivos médicos.</p>
          </div>
          <h3 className="mt-3 mb-1 text-xs uppercase leading-[20px] text-gray-400 text-left">
            <p>Crear cuenta</p>
          </h3>

          {/* Formulario para registro del usuario */}
          <form action="" className="flex flex-col gap-4 text-sm text-gray-600 dark:text-white" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                  <input 
                      className={`${errors.password ? "border-red-600": ""} input-form`}
                      type="password" id="password"
                      {...register("password", {
                          required: {value: true, message: 'La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.'},
                          pattern: {
                              value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?\\/]).{8,20}$/,
                              message: 'La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.'
                          }
                      })}
                  />
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
    )
}
export default SignupPage