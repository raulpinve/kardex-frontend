const Table = ({children, width = "min-w-[900px]"}) => {
    return (
        <div className='overflow-x-auto'>
            <table className={`${width} w-full `}>
                {children}
            </table>
        </div>
    );
};

export default Table;