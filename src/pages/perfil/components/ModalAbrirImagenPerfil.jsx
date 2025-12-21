import React, { useState } from 'react';
import Modal from '../../../shared/components/Modal';
import imageDefault from "../../../assets/images/image-default.png";
import Loader from '../../../shared/components/Loader';

const ModalAbrirImagenPerfil = (props) => {
    const {cerrarModal, usuario} = props;
    const [isLoading, setIsLoading] = useState(true); // Estado para manejar el loading

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
                <img 
                    src={`${usuario.avatar}`}
                    onLoad={handleImageLoad} 
                    className='w-full'
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imageDefault; 
                    }}
                    style={{ display: isLoading ? 'none' : 'block' }}  // Ocultar la imagen hasta que se haya cargado
                />
            </div>
        </Modal>
    );
};

export default ModalAbrirImagenPerfil;