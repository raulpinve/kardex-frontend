import MessageError from "../../../../shared/components/MessageError";
import { handleErrors } from "../../../../utils/handleErrors";
import { crearAlmacen } from "../../services/almacenService";
import Button from "../../../../shared/components/Button";
import Modal from "../../../../shared/components/Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ModalCrearAlmacen = (props) => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({  mode: "onChange" });
    const [messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const {cerrarModal, setAlmacenes} = props;

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const result = await crearAlmacen(values);
            const data = result?.data;
            setAlmacenes(prevAlmacenes => [data, ...prevAlmacenes]);
            cerrarModal();
            setValue("nombre", "");
            toast.success('Almacén creado exitosamente.');
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
            title="Crear Almacén"
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

export default ModalCrearAlmacen;