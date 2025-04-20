import React, { useEffect, useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import MessageError from "../../../../shared/components/MessageError";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { handleErrors } from "../../../../utils/handleErrors";
import { toast } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
// import { crearAlmacen } from "../../services/almacenService";

const ModalCrearCorte = (props) => {
    const { cerrarModal, setCortes } = props;
    const [messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state.auth.token);
    const [selectedDate, setSelectedDate] = useState(null);
    const {register, control, handleSubmit, setError, formState: { errors }, setValue} = useForm({  mode: "onChange" })

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            // const result = await crearAlmacen(token, values)
            // const data = result?.data
            // if(data){
                const numero = Math.floor(Math.random() * 1000000) + 1;
                const data = {
                   id: numero,
                    ...values,
                }
                setCortes(prevCortes => [data, ...prevCortes]);
                cerrarModal()
                setValue("nombre", "")
            // } 
            toast.success('Corte creado exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        setValue("mes", "2024-01")
    }, [])
    
    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Crear corte"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="px-2">
                    {/* Mes */}
                    <div className="relative">
                        <label htmlFor="mes" className="label-form">
                            Mes <span className="input-required">*</span>
                        </label>
                        <input 
                            type="month" 
                            className={`${errors?.mes ? "input-form-error" : ""} input-form capitalize`}
                            {...register("mes", {
                                required: {
                                    value: true,
                                    message: "Por favor, selecciona un mes.",
                                },
                            })}
                        />
                        {errors?.mes?.message && (<p className="input-message-error">{errors.mes.message}</p>)} 
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

export default ModalCrearCorte;