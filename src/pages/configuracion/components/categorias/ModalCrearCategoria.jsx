import React, { useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { handleErrors } from "../../../../utils/handleErrors";
import MessageError from "../../../../shared/components/MessageError";
import { toast } from "sonner";
import { crearCategoria } from "../../services/categoriaService";
import { LuChevronDown } from "react-icons/lu";

const ModalCrearCategoria = (props) => {
    const { cerrarModal, setCategorias} = props;
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
            const result = await crearCategoria(token, values)
            const data = result?.data
            if(data){
                setCategorias(prevCategorias => [data, ...prevCategorias]);
                cerrarModal()
                setValue("nombre", "")
                setValue("tipo", "")
            } 
            toast.success('Categoría creada exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }
    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Crear Categoría"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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

                {/* Tipo */}
                <div>
                    <label htmlFor="nombre" className="label-form">
                        Tipo <span className="input-required">*</span>
                    </label>
                    <div className="relative">
                        <LuChevronDown  className="absolute right-3.5 top-[13px] dark:text-gray-200" />                     
                        <select 
                            className={`${errors.tipo && errors.tipo.message ? "input-form-error" : ""} select-form`}
                            {...register("tipo", {
                                required: {
                                    value: true,
                                    message: "Debe seleccionar un tipo.",
                                },
                                validate: value => ["medicamento", "dispositivo"].includes(value) || "Tipo inválido"
                            })}
                            id="tipo"
                        >   
                            <option value="">Seleccionar...</option>
                            <option value="dispositivo">Dispositivo</option>
                            <option value="medicamento">Medicamento</option>
                        </select>
                    </div>
                    {errors.tipo && errors.tipo.message && (<p className="input-message-error">{errors.tipo.message}</p>)} 
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

export default ModalCrearCategoria;