import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import MessageError from "@/shared/components/MessageError";
import { cerrarCorte } from "../../services/cortesServices";
import { handleErrorsBasic } from "@/utils/handleErrors";
import { useForm } from "react-hook-form";

const ModalCerrarCorte = ({ cerrarModal, corteSeleccionado, setCortes }) => {
    const {register, handleSubmit, formState: { errors }, setValue} = useForm({ mode: "onChange" })
    const [messageError, setMessageError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            setMessageError(false);

            await cerrarCorte(corteSeleccionado.id, values);

            setCortes(prevCortes =>
                prevCortes.map(corte =>
                    corte.id === corteSeleccionado.id
                    ? { ...corte, fechaFin: values.fechaFin, nombre: values.nombre, cerrado: true }
                    : corte
                )
            );
            toast.success("Corte cerrado con éxito");
            setValue("nombre");
            setValue("fechaFin");
            cerrarModal();
        } catch (error) {
            handleErrorsBasic(error, setMessageError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Cerrar corte"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                {/* Nombre el período */}
                <div>
                    <label htmlFor="nombre" className="label-form">
                        Nombre del período <span className="input-required">*</span>
                    </label>
                    <input 
                        type="text" 
                        className={`${errors.nombre ? "input-form-error" : ""} input-form`}
                        placeholder="Ej: 01 de enero de 2026 - 31 de enero de 2026"
                        {...register("nombre", {
                                required: "El nombre del período es obligatorio",
                                minLength: {
                                value: 2,
                                message: "El nombre debe tener mínimo 2 caracteres"
                            },
                                maxLength: {
                                value: 100,
                                message: "El nombre no puede tener más de 100 caracteres"
                            }
                        })}
                    />
                    {errors.nombre && (<p className="input-message-error">{errors.nombre.message}</p>)} 
                </div>

                {/* Fecha final del corte */}
                <div className="relative">
                    <label htmlFor="fechaFin" className="label-form">
                        Fecha final del corte <span className="input-required">*</span>
                    </label>
                    <input 
                        type="date" 
                        className={`${errors.fechaFin ? "input-form-error" : ""} input-form`}
                        {...register("fechaFin", {
                            required: "La fecha es obligatoria",
                        })}
                    />
                    {errors.fechaFin && (<p className="input-message-error">{errors.fechaFin.message}</p>)} 
                </div>

                <div className="mt-3 text-red-600 text-sm">
                    <h2 className="font-semibold">Esta acción es irreversible. No podrás editar ni revertir este cierre.</h2>
                    <p>Al cerrar este corte, el período quedará bloqueado y no podrás realizar cambios en 
                        los movimientos de inventario de este rango de fechas.</p>
                </div>

                {messageError && 
                    <MessageError>
                        {messageError}
                    </MessageError>
                }

                <div className="mt-4 flex justify-end gap-2">
                    <Button 
                        colorButton="secondary"
                        textButton="Cancelar"
                        type="button"
                        onClick={() => cerrarModal(false)}
                    />
                    <Button 
                        colorButton="danger"
                        textButton="Cerrar corte"
                        loading={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ModalCerrarCorte;
