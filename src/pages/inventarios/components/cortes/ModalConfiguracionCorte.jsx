import { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

const ModalConfiguracionCorte = (props) => {
    const {cerrarModal} = props;
    const [tituloModal, setTituloModal] = useState("Configuración");
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);    

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title={tituloModal}
            size="md"
        >
            {!seccionSeleccionada && (<>
                <div className='flex gap-1 flex-wrap'>
                    <div>
                        <Button 
                            textButton={`Cerrar corte`} 
                        />
                    </div>
                    <Button 
                        textButton={`Eliminar corte`} 
                        colorButton={`danger`}
                    />
                </div>
            </>)}
            
        </Modal>
    );
};

export default ModalConfiguracionCorte;