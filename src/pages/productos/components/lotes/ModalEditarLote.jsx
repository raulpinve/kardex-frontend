import React, { useEffect, useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { handleErrors } from "../../../../utils/handleErrors";
import MessageError from "../../../../shared/components/MessageError";
import { toast } from "sonner";
import { editarLote } from "../../services/loteServices";
import { formatDate } from "../../../../utils/utilities";

const ModalEditarLote = (props) => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({ mode: "onChange" })
    const { cerrarModal, setLotes, loteSeleccionado} = props;
    const [messageError, setMessageError] = useState(false);
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(false);

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const result = await editarLote(token, loteSeleccionado.id, values)
            const data = result?.data
            if(data){
                setLotes(prevLotes =>
                    prevLotes.map(lote => {
                        return lote.id === data.id ? { ...lote, ...data } : lote
                    })
                );
                cerrarModal()
            } 
            toast.success('Lote editado exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if(loteSeleccionado){
            setValue("numeroLote", loteSeleccionado.numeroLote);
            setValue("registroSanitario", loteSeleccionado.registroSanitario);
            setValue("fechaVencimiento", formatDate(loteSeleccionado.fechaVencimiento));
        }
    }, [loteSeleccionado, setValue])

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Editar lote"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="px-2">
                    {/* Número de lote */}
                    <div>
                        <label htmlFor="numeroLote" className="label-form">
                            Número de lote <span className="input-required">*</span>
                        </label>
                        <input 
                            className={`${errors.numeroLote && errors.numeroLote.message ? "input-form-error" : ""} input-form`}
                            {...register("numeroLote", {
                                required: {
                                    value: true,
                                    message: "Debe proporcionar el número de Lote.",
                                },
                                minLength: {
                                    value: 2,
                                    message: "El número de lote debe tener al menos dos caracteres.",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "El número de lote no debe exceder los 50 caracteres.",
                                },
                            })}
                            id="numeroLote"
                        />
                        {errors?.numeroLote?.message && (<p className="input-message-error">{errors.numeroLote.message}</p>)} 
                    </div>

                    {/* Registro sanitario */}
                    <div>
                        <label htmlFor="registroSanitario" className="label-form">
                            Registro sanitario <span className="input-required">*</span>
                        </label>
                        <input 
                            className={`${errors.registroSanitario && errors.registroSanitario.message ? "input-form-error" : ""} input-form`}
                            {...register("registroSanitario", {
                                required: {
                                    value: true,
                                    message: "Debe proporcionar el registro sanitario",
                                },
                                minLength: {
                                    value: 2,
                                    message: "El registro sanitario debe tener al menos dos caracteres.",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "El registro sanitario no debe exceder los 50 caracteres.",
                                },
                            })}
                            id="registroSanitario"
                        />
                        {errors?.registroSanitario?.message && (<p className="input-message-error">{errors.registroSanitario.message}</p>)} 
                    </div>
                    
                    {/* Fecha de vencimiento */}
                    <div>
                        <label htmlFor="fechaVencimiento" className="label-form">
                            Fecha de vencimiento <span className="input-required">*</span>
                        </label>
                        <input
                            className={`${errors.fechaVencimiento?.message ? "input-form-error" : ""} input-form`}
                            type="date"
                            id="fechaVencimiento"
                            {...register("fechaVencimiento", {
                                required: "La fecha de vencimiento es obligatoria",
                            })}
                        />
                        {errors.fechaVencimiento?.message && (
                            <p className="input-message-error">{errors.fechaVencimiento.message}</p>
                        )}
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

export default ModalEditarLote;