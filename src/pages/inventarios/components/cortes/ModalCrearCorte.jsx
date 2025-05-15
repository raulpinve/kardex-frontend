import React, { useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import MessageError from "../../../../shared/components/MessageError";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { crearCorte } from "../../services/cortesServices";
import SkeletonElement from "../../../../shared/components/SkeletonElement";
import { useNavigate } from "react-router-dom";

const ModalCrearCorte = (props) => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const [messageError, setMessageError] = useState(false);
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [periodo, setPeriodo] = useState("");
    const navigate = useNavigate();
    const { cerrarModal } = props;

    const submitCrearCorte = async () => {
        try {
            setLoading(true);
            setMessageError(false);
            const res = await crearCorte(token, {
                almacenId, 
                periodoCorte: periodo
            });
            toast.success("Corte creado con éxito");
            navigate(`/inventarios/${res.data.periodo}`);
            cerrarModal();
        } catch (error) {
            setMessageError(error?.response?.data?.message || "Ha ocurrido un error al intentar crear el corte.")
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
            { loading && (<SkeletonElement className="h-[36px]" />) }
            { !loading && (
                <>
                    <div className="relative">
                        <label htmlFor="mes" className="label-form">
                            Nuevo período <span className="input-required">*</span>
                        </label>
                        <input 
                            type="month" 
                            className="input-form"
                            value={periodo}
                            onChange={(e) => setPeriodo(e.currentTarget.value)}
                        />
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
                            onClick={submitCrearCorte}
                            loading = {loading}
                            type= "submit"
                        />
                    </div>
                </>
            )}

        </Modal>
    );
};

export default ModalCrearCorte;