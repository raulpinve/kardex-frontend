import { useEffect, useState } from 'react'
import Modal from './Modal'
import { useSelector } from 'react-redux'
import Button from './Button'
import {handleErrorsBasic } from '../../utils/handleErrors'
import { solicitarVerificarEmail } from '../services/verificarEmailService'

const VerificarEmail = () => {
    const usuario = useSelector(state => state.auth.usuario);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [codigoEnviado, setCodigoEnviado] = useState(false);
    const [messageError, setMessageError] = useState(null);

    useEffect(() => {
        if(usuario && !usuario.emailVerificado){
            setIsOpenModal(true)
        }
    }, [usuario])

    const handleClick = async () => {
        try {
            setLoading(true)
            await solicitarVerificarEmail()
            setCodigoEnviado(true)
        } catch (error) {
            handleErrorsBasic(error, setMessageError)
        } finally{
            setLoading(false)
        }
    }
    return (
        <Modal
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
            title="Advertencia"
            size="md"
        >
            <div>
                {codigoEnviado ? (<>
                    <p>✅ Te hemos enviado un correo con las instrucciones necesarias para verificar tu cuenta de correo electrónico.</p>
                    <div className='grid justify-center mt-3'>
                        <Button 
                            textButton={`Aceptar`}
                            colorButton={`primary`}
                            onClick={() => {setIsOpenModal(false)}}
                        />
                    </div>
                </>
                ):( <>
                        <p>No has verificado tu correo electrónico. Por favor, haz clic en el botón a continuación para enviarte un correo de verificación.</p>
                        {/* Mensaje de error */}
                        {messageError && <p className="message-error mt-5">{messageError}</p>}
                        <div className='mt-3'>
                            <Button 
                                textButton={`Enviar correo`}
                                colorButton={`primary`}
                                loading={loading}
                                onClick={handleClick}
                            />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}

export default VerificarEmail