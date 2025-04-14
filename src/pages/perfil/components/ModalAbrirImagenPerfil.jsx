import React from 'react';
import Modal from '../../../shared/components/Modal';
import { host } from '../../../utils/config';

const ModalAbrirImagenPerfil = (props) => {
    const {cerrarModal, usuario} = props;
    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title="Imagen de perfil"
            size="lg"
        >
            <div className='max-h-[70vh] overflow-y-auto'>
                <img 
                    src={`${host}/uploads/avatar-usuarios/${usuario.id}/${usuario.avatar}`}
                    alt="" 
                />
            </div>
        </Modal>
    );
};

export default ModalAbrirImagenPerfil;