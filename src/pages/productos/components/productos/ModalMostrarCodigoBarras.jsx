import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Barcode from "react-barcode";

const ModalMostrarCodigoBarras = (props) => {
    const {cerrarModal, productoSeleccionado} = props;
    const formato = productoSeleccionado?.tipoCodigoBarras === "EAN13" ? "EAN13" : "CODE128";

    return (
        <Modal
            isOpenModal={true}
            setIsOpenModal={cerrarModal}
            title={`Código de barras`}
            size="md"
        >
            <div className="flex justify-center">
                <div>
                    <Barcode
                        value={productoSeleccionado?.codigoBarra}
                        format={formato}
                        width={2}
                        height={80}
                        displayValue={true}
                        background="#fff"
                        lineColor="#000"
                    />
                    <small className='text-center block' style={{ color: "#666" }}>
                        {productoSeleccionado?.tipoCodigoBarra === "INTERNO" ? "Código interno del sistema" : productoSeleccionado?.tipoCodigoBarra}
                    </small>
                </div>
            </div>
        </Modal>
    );
};

export default ModalMostrarCodigoBarras;    