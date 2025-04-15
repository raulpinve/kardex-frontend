import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { host } from '../../../../utils/config';
import Loader from '../../../../shared/components/Loader';
import { useSelector } from 'react-redux';
import imageDefault from "../../../../assets/image-default.png";

const ModalAbrirImagenPerfil = (props) => {
    const {cerrarModal, medicamento} = props;
    const [isLoading, setIsLoading] = useState(true); 
    const token = useSelector(state => state.auth.token);
    const [imageSrc, setImageSrc] = useState("");
    
    useEffect(() => {
        const cargarImagen = async () => {
            try {
                const response = await fetch(`${host}/medicamentos/${medicamento.id}/avatar`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar la imagen');
                }

                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageSrc(imageUrl);  // Establece la imagen si se carga correctamente
            } catch (error) {
                console.error('Error al obtener la imagen:', error);
                setImageSrc(imageDefault);  // Si hay error, muestra la imagen por defecto
            }
        };

        cargarImagen();
    }, [medicamento.id, token, imageDefault]);

    const handleImageLoad = () => {
        setIsLoading(false); // Cuando la imagen se haya cargado, se desactiva el loader
    };

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Imagen de perfil"
            size="lg"
        >
            <div>
                {isLoading && <Loader />} {/* Mostrar el loader mientras la imagen carga */}
                {imageSrc && (
                    <img 
                        src={imageSrc}
                        alt="" 
                        onLoad={handleImageLoad} 
                        style={{ display: isLoading ? 'none' : 'block' }}  // Ocultar la imagen hasta que se haya cargado
                    />
                )}
            </div>
        </Modal>
    );
};

export default ModalAbrirImagenPerfil;