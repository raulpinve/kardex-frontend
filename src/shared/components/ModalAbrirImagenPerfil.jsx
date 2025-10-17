import React, { useState } from 'react';
import Modal from './Modal';
import imageDefault from "../../assets/images/image-default.png"
import Loader from './Loader';
import { host } from '../../utils/config';

const ModalAbrirImagenPerfil = ({cerrarModal, urlImage, tipo = "perfil"}) => {
    const [loading, setLoading] = useState(true);
    const handleImageLoad = () => {
        setLoading(false); 
    };

    let titulo;
    if(tipo === "dispositivo" || tipo === "dispositivos"){
        titulo = "Imagen del dispositivo";
    }else if (tipo === "medicamento" || tipo === "medicamentos"){
        titulo = "Imagen del medicamento";
    }else{
        titulo = "Imagen de perfil";
    }

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title= {titulo}
            size="lg"
        >
            <div>
                {loading && <Loader />} {/* Mostrar el loader mientras la imagen carga */}
                <img 
                    src={host + urlImage}
                    className='w-full'
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imageDefault; 
                    }}
                    onLoad={handleImageLoad} 
                    style={{ display: loading ? 'none' : 'block' }}  // Ocultar la imagen hasta que se haya cargado
                />
            </div>
        </Modal>
    );
};

export default ModalAbrirImagenPerfil;