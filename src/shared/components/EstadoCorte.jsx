const estilosPorEstado = {
    cerrado1: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
    abierto: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200',
    cerrado: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
};

const EstadoCorte = ({ estado }) => {
    const estilo = estilosPorEstado[estado] || estilosPorEstado.default;

    return (
        <div className={`p-1 rounded-full w-[110px] text-center text-xs mx-auto font-semibold capitalize ${estilo}`}>
            {estado}
        </div>
    );
};

export default EstadoCorte;