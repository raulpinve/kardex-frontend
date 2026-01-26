// Cambia el valor por defecto a "" para que sea fluido en móvil
const Table = ({children, width = "min-w-[900px]"}) => {
    return (
        <div className='overflow-x-auto text-sm'>
            <table className={`${width} w-full `}>
                {children}
            </table>
        </div>
    );
};

export default Table;