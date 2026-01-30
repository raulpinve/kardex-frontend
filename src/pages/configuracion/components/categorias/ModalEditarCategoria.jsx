import MessageError from "../../../../shared/components/MessageError";
import { editarCategoria } from "../../services/categoriaService";
import { handleErrors } from "../../../../utils/handleErrors";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ModalEditarCategoria = (props) => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({ mode: "onChange" })
    const { cerrarModal, setCategorias, categoriaSeleccionada} = props;
    const [messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const result = await editarCategoria(categoriaSeleccionada.id, values)
            const data = result?.data
            if(data){
                setCategorias(prevCategorias =>
                    prevCategorias.map(categoria =>
                        categoria.id === data.id
                            ? { ...categoria, nombre: data.nombre }
                            : categoria
                    )
                );
                cerrarModal()
                setValue("nombre", "")
            } 
            toast.success('Categoría editada exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if(categoriaSeleccionada){
            setValue("nombre", categoriaSeleccionada.nombre);
        }
    }, [categoriaSeleccionada, setValue])

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Editar almacén"
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

export default ModalEditarCategoria;