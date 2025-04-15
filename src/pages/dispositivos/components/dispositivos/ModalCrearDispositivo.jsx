import React, { useEffect, useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { handleErrors } from "../../../../utils/handleErrors";
import MessageError from "../../../../shared/components/MessageError";
import { toast } from "sonner";
import { crearDispositivo } from "../../services/dispositivosServices";

const ModalCrearDispositivo = (props) => {
    const { cerrarModal, setDispositivos, almacenId} = props;
    const [messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state.auth.token);
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({ 
        mode: "onChange"
    })

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const result = await crearDispositivo(token, {
                ...values,
                almacenId
            })
            const data = result?.data
            if(data){
                setDispositivos(prevDispositivos => [data, ...prevDispositivos]);
                cerrarModal()
            } 
            toast.success('Dispositivo creado exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        setValue("nombre", "Sonda levin");
        setValue("serie", "N/A");
        setValue("riesgo", "IIA");
        setValue("presentacionComercial", "Unidad");
        setValue("stockRequerido", 5);
    }, [])

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Crear dispositivo"
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="px-2 grid lg:grid-cols-2 gap-2">
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
                    
                    {/* Stock requerido */}
                    <div>
                        <label htmlFor="stockRequerido" className="label-form">
                            Stock requerido <span className="input-required">*</span>
                        </label>
                        <input 
                            type="number"
                            className={`${errors.stockRequerido && errors.stockRequerido.message ? "input-form-error" : ""} input-form`}
                            {...register("stockRequerido", {
                                required: "El stock requerido debe ser mayor que cero",
                                valueAsNumber: true,
                                min: {
                                    value: 1,
                                    message: "El stock requerido debe ser mayor que cero",
                                }
                            })}
                            id="stockRequerido"
                        />
                        {errors.stockRequerido && errors.stockRequerido.message && (<p className="input-message-error">{errors.stockRequerido.message}</p>)} 
                    </div>
                </div>

                {messageError || errors.almacenId && 
                    <MessageError>
                        {messageError || errors.almacenId.message}
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

export default ModalCrearDispositivo;