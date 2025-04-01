const formatDateLetters = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    const readableDate = date.toLocaleDateString('es-ES', options);
    return readableDate;
}

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return `${year}-${month}-${day}`;
};


export {
    formatDateLetters,
    formatDate
}