import React, { useEffect, useState } from "react";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import MessageError from "../../../../shared/components/MessageError";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { crearCorte, obtenerFechaCorte } from "../../services/cortesServices";
import SkeletonElement from "../../../../shared/components/SkeletonElement";
import { LuCalendar } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { formatDateCorte } from "@/utils/utilities";

const ModalCrearCorte = (props) => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const [messageError, setMessageError] = useState(false);
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [loadingCrearCorte, setLoadingCrearCorte] = useState(false);
    const [periodo, setPeriodo] = useState(null);
    const navigate = useNavigate();
    const { cerrarModal } = props;

    // Obtener la información de la fecha del nuevo corte
    useEffect(() => {
        const fetchFechaCorte = async () => {
            setLoading(true);
            try {
                const res = await obtenerFechaCorte(token, almacenId); 
                setPeriodo(res.data)
            } catch (error) {
                console.error(error);
            } finally  {
                setLoading(false);
            }
        }
        fetchFechaCorte();
    }, [token, almacenId])

    const submitCrearCorte = async () => {
        try {
            setLoadingCrearCorte(true);
            setMessageError(false);
            const res = await crearCorte(token, {
                almacenId
            });
            toast.success("Corte creado con éxito");
            navigate(`/inventarios/${res.data.id}`);
            cerrarModal();
        } catch (error) {
            setMessageError(error?.response?.data?.message || "Ha ocurrido un error al intentar crear el corte.")
        } finally {
            setLoadingCrearCorte(false);
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
                        <input type="month" className="input-form" />
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
                            loading = {loadingCrearCorte}
                            type= "submit"
                        />
                    </div>
                </>
            )}

        </Modal>
    );
};

export default ModalCrearCorte;