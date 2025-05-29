import React, { useEffect, useState } from "react";
import Modal from "../../../../shared/components/Modal";
import { toast } from "sonner";
import { handleErrors } from "../../../../utils/handleErrors";
import { useForm } from "react-hook-form";
import { LuChevronDown } from "react-icons/lu";
import MessageError from "../../../../shared/components/MessageError";
import Button from "../../../../shared/components/Button";
import { crearMovimiento } from "../../services/movimientoServices";
import { useSelector } from "react-redux";

const ModalCrearMovimiento = (props) => {
    const { cerrarModal, setMovimientos, loteId, lote, actualizarLote} = props;
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({ mode: "onChange" })
    const [messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state.auth.token);

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const respuesta = await crearMovimiento(token, {
                ...values, 
                loteId,
            })
            const data = respuesta.data;
            if(data){
                if(setMovimientos){
                  setMovimientos(prevMovimientos => [data, ...prevMovimientos]);
                }
                cerrarModal();
                setValue("tipo", "");
                setValue("cantidad", "");
                setValue("fecha", "");
                setValue("descripcion", "");
                if(actualizarLote){
                  actualizarLote(loteId, values.tipo, values.cantidad);
                }
            }
            toast.success("Movimiento creado exitosamente.");
        } catch (error) {
            console.log(error)
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }
    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title={lote ? "Registrar movimiento": "Crear movimiento"}
            description = {lote ? "Crea un nuevo movimiento el lote " + lote?.numeroLote : ""}
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div>
                    {/* Tipo */}
                    <div>
                        <label htmlFor="numeroLote" className="label-form">
                            Tipo <span className="input-required">*</span>
                        </label>
                        <div className="relative">
                            <select 
                                className={`${errors.tipo && errors.tipo.message ? "input-form-error" : ""} input-form`}
                                {...register("tipo", {
                                    required: {
                                        value: true,
                                        message: "Debe seleccionar un tipo.",
                                    }
                                })}
                                id="tipo"
                            >
                                <option value="">Seleccionar tipo...</option>
                                <option value="entrada">Entrada</option>
                                <option value="salida">Salida</option>
                            </select>
                            <LuChevronDown className="absolute right-3 top-[14px]" />
                        </div>
                        {errors?.numeroLote?.message && (<p className="input-message-error">{errors.numeroLote.message}</p>)} 
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label htmlFor="cantidad" className="label-form">
                            Cantidad <span className="input-required">*</span>
                        </label>
                        <input 
                            className={`${errors.cantidad && errors.cantidad.message ? "input-form-error" : ""} input-form`}
                            {...register("cantidad", {
                                required: {
                                    value: true,
                                    message: "Debe proporcionar una cantidad.",
                                }
                            })}
                            id="cantidad"
                            type="number"
                        />
                        {errors?.cantidad?.message && (<p className="input-message-error">{errors.cantidad.message}</p>)} 
                    </div>

                    {/* Fecha */}
                    <div>
                        <label htmlFor="fecha" className="label-form">
                            Fecha <span className="input-required">*</span>
                        </label>
                        <input 
                            className={`${errors.fecha && errors.fecha.message ? "input-form-error" : ""} input-form`}
                            {...register("fecha", {
                                required: {
                                    value: true, 
                                    message: "Debe proporcionar una fecha."
                                }
                            })}
                            id="fecha"
                            type="date"
                        />
                        {errors?.fecha?.message && (<p className="input-message-error">{errors.fecha.message}</p>)} 
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="descripcion" className="label-form">
                            Descripción <span className="input-required">*</span>
                        </label>
                        <textarea 
                            className={`${errors.descripcion && errors.descripcion.message ? "input-form-error" : ""} input-form resize-none h-[70px]`}
                            {...register("descripcion", {
                                required: {
                                    value: true, 
                                    message: "Debe proporcionar una descripción."
                                }
                            })}
                        ></textarea>
                        {errors?.descripcion?.message && (<p className="input-message-error">{errors.descripcion.message}</p>)} 
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

export default ModalCrearMovimiento;