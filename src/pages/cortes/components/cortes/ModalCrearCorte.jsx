import React, { useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import MessageError from "../../../../shared/components/MessageError";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { crearCorte } from "../../services/cortesServices";
import { useNavigate } from "react-router-dom";
import { handleErrorsBasic } from "@/utils/handleErrors";
import { useForm } from "react-hook-form";

const ModalCrearCorte = (props) => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({ mode: "onChange" })
    const almacenId = useSelector(state => state?.almacen?.almacen?.id);
    const [messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { cerrarModal, setCortes } = props;

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            setMessageError(false);

            const res = await crearCorte({
                almacenId, 
                ...values
            });
            setCortes(prevCortes => [res.data, ...prevCortes]);
            toast.success("Corte creado con éxito");
            cerrarModal();
        } catch (error) {
            handleErrorsBasic(error, setMessageError)
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Crear corte"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="relative">
                    <label htmlFor="mes" className="label-form">
                        Fecha de inicio del corte<span className="input-required">*</span>
                    </label>
                    <input 
                        type="date" 
                        className={`${errors.fechaInicio ? "input-form-error" : ""} input-form`}
                        {...register("fechaInicio", {
                            required: "La fecha es obligatoria",
                        })}
                    />
                    {errors.fechaInicio && (<p className="input-message-error">{errors.fechaInicio.message}</p>)} 
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
                        textButton={`Crear corte`}
                        loading = {loading}
                        type= "submit"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ModalCrearCorte;