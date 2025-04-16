import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import Loader from '../../../../shared/components/Loader';
import { obtenerAvatarMedicamento } from '../../services/MedicamentoServices';
import { useSelector } from 'react-redux';
import { host } from '../../../../utils/config';
import { toast } from 'sonner';
import imageDefault from "../../../../assets/image-default.png"

const ModalAbrirImagenPerfil = (props) => {
    const {cerrarModal,  medicamento} = props;
    const [loading, setLoading] = useState(true); 
    const token = useSelector(state => state.auth.token);
    const [imageSrc, setImageSrc] = useState(false);

    // Obtener información del medicamento 
    useEffect(() => {
        const fetchMedicamento = async() => {
            try {
                setLoading(true);
                const response = await obtenerAvatarMedicamento(token, medicamento.id)
                if(response?.data?.avatar){
                    setImageSrc(`${host}${response.data.avatar}`);
                }
            } catch (error) {
                cerrarModal()
                toast.error(error?.response?.data?.message || "Ha ocurrido un error al cargar la imagen")
            } finally {
                setLoading(false)
            }
        }
        if(medicamento?.id){
            fetchMedicamento();
        }
    },[medicamento])

    const handleImageLoad = () => {
        setLoading(false); // Cuando la imagen se haya cargado, se desactiva el loader
    };

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Imagen de perfil"
            size="lg"
        >
            <div>
                {loading && <Loader />} {/* Mostrar el loader mientras la imagen carga */}
                {imageSrc && (
                    <img 
                        src={imageSrc}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = imageDefault; 
                        }}
                        onLoad={handleImageLoad} 
                        style={{ display: loading ? 'none' : 'block' }}  // Ocultar la imagen hasta que se haya cargado
                    />
                )}
            </div>
        </Modal>
    );
};

export default ModalAbrirImagenPerfil;