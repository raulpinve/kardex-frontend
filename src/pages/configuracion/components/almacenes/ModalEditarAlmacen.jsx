import React, { useEffect, useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { handleErrors } from "../../../../utils/handleErrors";
import MessageError from "../../../../shared/components/MessageError";
import { toast } from "sonner";
import { editarAlmacen } from "../../services/almacenService";
import { setAlmacen } from "@/store/almacenSlice";

const ModalEditarAlmacen = (props) => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({ mode: "onChange" })
    const { cerrarModal, setAlmacenes, almacenSeleccionado} = props;
    const [messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const onSubmit = async(values) => {
        setMessageError(false);
        setLoading(true);

        try {
            const result = await editarAlmacen(almacenSeleccionado.id, values);
            const data = result?.data;
            setAlmacenes(prevAlmacenes =>
                prevAlmacenes.map(almacen => {
                    return almacen.id === data.id ? { ...almacen, ...data } : almacen
                })
            );
            cerrarModal();
            setValue("nombre", "");
            dispatch(setAlmacen(data));
            
            toast.success('Almacén editado exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if(almacenSeleccionado){
            setValue("nombre", almacenSeleccionado.nombre);
        }
    }, [almacenSeleccionado, setValue])

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Editar Almacén"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="nombre" className="label-form">
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

export default ModalEditarAlmacen;