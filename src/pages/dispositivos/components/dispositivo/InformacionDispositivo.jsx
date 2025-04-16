import Card from "../../../../shared/components/Card";
import CardTitulo from "../../../../shared/components/CardTitulo";
import MessageError from "../../../../shared/components/MessageError";
import SubirImagenPerfilDispositivo from "./SubirImagenPerfilDispositivo";

const InformacionDispositivo = ({dispositivo, setDispositivo, loading, error}) => {
    return (
        <div className="text-sm text-gray-700 dark:text-gray-400 max-w-[450px]">
            <Card>
                {/* Loading */}
                {loading && (<div>
                    <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[25px] mb-3"></div>
                    <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg w-44 h-32 mx-auto my-5"></div>
                        {   
                            [...Array(5)].map((_,index) => <div key={index} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[25px] mb-3"></div>)
                        }
                </div>)}
                {!loading && error && <MessageError>{error}</MessageError>}
                {!loading && dispositivo && ( <>
                    <CardTitulo>{dispositivo.nombre}</CardTitulo>
                    <SubirImagenPerfilDispositivo dispositivo={dispositivo} setDispositivo = {setDispositivo}/>
                    <div className="mt-5">
                        {/* Presentacion comercial */}
                        <div>
                            <p>Presentacion comercial</p>
                            <p className="font-semibold">{dispositivo.presentacionComercial}</p>
                        </div>

                        {/* Serie */}
                        <div className="mt-4">
                            <p>Serie</p>
                            <p className="font-semibold">{dispositivo.serie}</p>
                        </div>

                        {/* Riesgo */}
                        <div className="mt-4">
                            <p>Riesgo</p>
                            <p className="font-semibold">{dispositivo.riesgo}</p>
                        </div>
                    </div>
                </>
                )}
            </Card>
        </div>
    );
};

export default InformacionDispositivo;