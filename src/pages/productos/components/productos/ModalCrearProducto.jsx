import MessageError from "../../../../shared/components/MessageError";
import { handleErrors } from "../../../../utils/handleErrors";
import { crearProducto } from "../../services/productoServices";
import Button from "../../../../shared/components/Button";
import Modal from "../../../../shared/components/Modal";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { LuChevronDown } from "react-icons/lu";
import { obtenerTodasCategorias } from "../../services/categoriaServices";

const ModalCrearProducto = (props) => {
    const {register, handleSubmit, setError, formState: { errors }, setValue, reset} = useForm({  mode: "onChange" })
    const { cerrarModal, setProductos, tipo, almacenId} = props;
    const [messageError, setMessageError] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state.auth.token);

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const result = await crearProducto(token, {
                ...values,
                almacenId
            }, tipo)
            const data = result?.data;
            setProductos(prevProductos => [data, ...prevProductos]);
            cerrarModal();
            reset();
            toast.success(`${tipo === "medicamentos" ? "Medicamento": "Dispositivo"} creado exitosamente.`);
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    // Obtener categorias
    useEffect(() => {
        const fecthCategorias = async() => {
            try {
                const result = await obtenerTodasCategorias(token, tipo === "medicamentos" ? "medicamento": "dispositivo");
                setCategorias(result.data)
            } catch (error) {
                console.error(error);
            }
        }
        fecthCategorias();

    }, [tipo])

    useEffect(() => {
        setValue("nombre", "Glicerina")
        setValue("formaFarmaceutica", "Forma farmaceutica")
        setValue("codigoBarra", "444444")
        setValue("concentracion", "25mg")
        setValue("presentacionComercial", "Frasco")
        setValue("unidadMedida", "ml")
        setValue("stockRequerido", 25)
    }, [])

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title={`Crear ${tipo === "medicamentos" ? "medicamento" : "dispositivo"}`}
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="px-2 grid lg:grid-cols-2 gap-2">

                    {tipo === "medicamentos" ? (<>
                        {/* Principio activo */}
                        <div>
                            <label htmlFor="nombre" className="label-form">
                                Principio activo <span className="input-required">*</span>
                            </label>
                            <input 
                                className={`${errors.nombre && errors.nombre.message ? "input-form-error" : ""} input-form`}
                                {...register("nombre", {
                                    required: {
                                        value: true,
                                        message: "Debe proporcionar un principio activo.",
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "El principio activo debe tener al menos dos caracteres.",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "El principio activo no debe exceder los 100 caracteres.",
                                    },
                                })}
                                id="nombre"
                            />
                            {errors.nombre && errors.nombre.message && (<p className="input-message-error">{errors.nombre.message}</p>)} 
                        </div>

                        {/* Código de barras */}
                        <div>
                            <label htmlFor="codigoBarra" className="label-form">Código de barras</label>
                            <input 
                                className={`${errors.codigoBarra && errors.codigoBarra.message ? "input-form-error" : ""} input-form`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                                {...register("codigoBarra", {
                                    minLength: {
                                        value: 6,
                                        message: "El código de barras debe tener al menos 6 caracteres.",
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: "El código de barras no debe exceder los 30 caracteres.",
                                    },
                                })}
                                id="codigoBarra"
                            />
                            {errors.codigoBarra && errors.codigoBarra.message && (<p className="input-message-error">{errors.codigoBarra.message}</p>)} 
                        </div>

                        {/* Forma farmaceutica */}
                        <div>
                            <label htmlFor="codigoBarra" className="label-form">
                                Forma farmacéutica <span className="input-required">*</span>
                            </label>
                            <input 
                                className={`${errors.formaFarmaceutica && errors.formaFarmaceutica.message ? "input-form-error" : ""} input-form`}
                                {...register("formaFarmaceutica", {
                                    required: {
                                        value: true,
                                        message: "Debe proporcionar una forma farmacéutica.",
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "La forma farmacéutica debe tener al menos dos caracteres.",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "La forma farmacéutica no debe exceder los 100 caracteres.",
                                    },
                                })}
                                id="formaFarmaceutica"
                            />
                            {errors.formaFarmaceutica && errors.formaFarmaceutica.message && (<p className="input-message-error">{errors.formaFarmaceutica.message}</p>)} 
                        </div>
                        
                        {/* Concentración */}
                        <div>
                            <label htmlFor="concentracion" className="label-form">
                                Concentración <span className="input-required">*</span>
                            </label>
                            <input 
                                className={`${errors.concentracion && errors.concentracion.message ? "input-form-error" : ""} input-form`}
                                {...register("concentracion", {
                                    required: {
                                        value: true,
                                        message: "Debe proporcionar una concentración.",
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "La concentración debe tener al menos dos caracteres.",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "La concentración no debe exceder los 100 caracteres.",
                                    },
                                })}
                                id="concentracion"
                            />
                            {errors.concentracion && errors.concentracion.message && (<p className="input-message-error">{errors.concentracion.message}</p>)} 
                        </div>

                        {/* Presentación comercial */}
                        <div>
                            <label htmlFor="presentacionComercial" className="label-form">
                                Presentación comercial <span className="input-required">*</span>
                            </label>
                            <input 
                                className={`${errors.presentacionComercial && errors.presentacionComercial.message ? "input-form-error" : ""} input-form`}
                                {...register("presentacionComercial", {
                                    required: {
                                        value: true,
                                        message: "Debe proporcionar una presentación comercial.",
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "La presentación comercial debe tener al menos dos caracteres.",
                                    },
                                    maxLength: {
                                        value: 200,
                                        message: "La presentación comercial no debe exceder los 200 caracteres.",
                                    },
                                })}
                                id="presentacionComercial"
                            />
                            {errors.presentacionComercial && errors.presentacionComercial.message && (<p className="input-message-error">{errors.presentacionComercial.message}</p>)} 
                        </div>

                        {/* Unidad medica */}
                        <div>
                            <label htmlFor="unidadMedida" className="label-form">
                                Unidad médica <span className="input-required">*</span>
                            </label>
                            <input 
                                className={`${errors.unidadMedida && errors.unidadMedida.message ? "input-form-error" : ""} input-form`}
                                {...register("unidadMedida", {
                                    required: {
                                        value: true,
                                        message: "Debe proporcionar la unidad médica.",
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "La unidad médica debe tener al menos dos caracteres.",
                                    },
                                    maxLength: {
                                        value: 200,
                                        message: "La unidad médica no debe exceder los 200 caracteres.",
                                    },
                                })}
                                id="unidadMedida"
                            />
                            {errors.unidadMedida && errors.unidadMedida.message && (<p className="input-message-error">{errors.unidadMedida.message}</p>)} 
                        </div>
                    </>):(<>
                        {/* Nombre */}
                        <div>
                            <label htmlFor="formaFarmaceutica" className="label-form">
                                Nombre <span className="input-required">*</span>
                            </label>
                            <input 
                                className={`${errors.nombre && errors.nombre.message ? "input-form-error" : ""} input-form`}
                                {...register("nombre", {
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
                                id="nombre"
                            />
                            {errors.nombre && errors.nombre.message && (<p className="input-message-error">{errors.nombre.message}</p>)} 
                        </div>

                        {/* Código de barras */}
                        <div>
                            <label htmlFor="codigoBarra" className="label-form">Código de barras</label>
                            <input 
                                className={`${errors.codigoBarra && errors.codigoBarra.message ? "input-form-error" : ""} input-form`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                                {...register("codigoBarra", {
                                    minLength: {
                                        value: 6,
                                        message: "El código de barras debe tener al menos 6 caracteres.",
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: "El código de barras no debe exceder los 30 caracteres.",
                                    },
                                })}
                                id="codigoBarra"
                            />
                            {errors.codigoBarra && errors.codigoBarra.message && (<p className="input-message-error">{errors.codigoBarra.message}</p>)} 
                        </div>

                        {/* Serie */}
                        <div>
                            <label htmlFor="serie" className="label-form">
                                Serie 
                            </label>
                            <input 
                                className={`${errors.serie && errors.serie.message ? "input-form-error" : ""} input-form`}
                                {...register("serie", {
                                    minLength: {
                                        value: 2,
                                        message: "La serie debe tener al menos dos caracteres.",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "La serie no debe exceder los 100 caracteres.",
                                    },
                                })}
                                id="serie"
                            />
                            {errors.serie && errors.serie.message && (<p className="input-message-error">{errors.serie.message}</p>)} 
                        </div>
                
                        {/* Riesgo */}
                        <div>
                            <label htmlFor="riesgo" className="label-form">
                                Riesgo <span className="input-required">*</span>
                            </label>
                            <div className="relative">
                                <select 
                                    className={`${errors.riesgo && errors.riesgo.message ? "input-form-error" : ""} select-form`}
                                    {...register("riesgo", {
                                        required: {
                                            value: true,
                                            message: "Debe seleccionar un riesgo.",
                                        },
                                        validate: value => ["I", "IIA", "IIB", "III"].includes(value) || "riesgo inválido"
                                    })}
                                    id="riesgo"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="I">I</option>
                                    <option value="IIA">IIA</option>
                                    <option value="IIB">IIB</option>
                                    <option value="v">III</option>
                                </select>
                                <LuChevronDown className="absolute top-[16px] right-2" />
                            </div>
                            {errors.riesgo && errors.riesgo.message && (<p className="input-message-error">{errors.riesgo.message}</p>)} 
                        </div>

                        {/* Presentación comercial */}
                        <div>
                            <label htmlFor="presentacionComercial" className="label-form">
                                Presentación comercial <span className="input-required">*</span>
                            </label>
                            <input 
                                className={`${errors.presentacionComercial && errors.presentacionComercial.message ? "input-form-error" : ""} input-form`}
                                {...register("presentacionComercial", {
                                    required: {
                                        value: true,
                                        message: "Debe proporcionar una presentación comercial.",
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "La presentación comercial debe tener al menos dos caracteres.",
                                    },
                                    maxLength: {
                                        value: 200,
                                        message: "La presentación comercial no debe exceder los 200 caracteres.",
                                    },
                                })}
                                id="presentacionComercial"
                            />
                            {errors.presentacionComercial && errors.presentacionComercial.message && (<p className="input-message-error">{errors.presentacionComercial.message}</p>)} 
                        </div>
                    </>)}
                    
                    {/* Stock requerido */}
                    <div>
                        <label htmlFor="stockRequerido" className="label-form">
                            Stock requerido <span className="input-required">*</span>
                        </label>
                        <input 
                            type="number"
                            min={0}
                            className={`${errors.stockRequerido && errors.stockRequerido.message ? "input-form-error" : ""} input-form`}
                            {...register("stockRequerido", {
                                required: "Debe proporcionar un stock requerido",
                                valueAsNumber: true,
                                min: {
                                    value: 0,
                                    message: "El stock requerido debe ser igual o mayor que cero",
                                }
                            })}
                            id="stockRequerido"
                        />
                        {errors.stockRequerido && errors.stockRequerido.message && (<p className="input-message-error">{errors.stockRequerido.message}</p>)} 
                    </div>

                    {/* Categoría (opcional) */}
                    <div>
                        <label htmlFor="categoriaId" className="label-form">
                            Categoría
                        </label>
                        <div className="relative">
                            <select
                                className={`select-form`}
                                {...register("categoriaId")}
                                id="categoriaId"
                            >
                            <option value="">Seleccionar...</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                            <LuChevronDown className="absolute top-[16px] right-2" />
                        </div>
                    </div>
                </div>
                {messageError && (
                    <MessageError>
                        {messageError || errors.almacenId.message}
                    </MessageError>
                )}
                {errors.almacenId && 
                    <MessageError>
                        {errors.almacenId.message}
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

export default ModalCrearProducto;