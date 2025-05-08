const formatDateLetters = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    const readableDate = date.toLocaleDateString('es-ES', options);
    return readableDate;
}

const formatDate = (isoDate) => {
  return new Date(isoDate).toISOString().split('T')[0];
};

const formatFechaCorte = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const dateColombiaFormat = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const obtenerEstadoVencimiento = (fechaVencimientoStr) => {
  const hoy = new Date();
  const vencimiento = new Date(fechaVencimientoStr);
  const msEnUnDia = 1000 * 60 * 60 * 24;
  const diasRestantes = Math.ceil((vencimiento - hoy) / msEnUnDia);

  if (diasRestantes < 0) {
      return { estado: "Vencido", color: "text-red-600 bg-red-600/10" };
  } else if (diasRestantes <= 30) {
      return { estado: "Por vencer", color: "text-orange-600 bg-orange-600/10" };
  } else if (diasRestantes <= 90) {
      return { estado: "Por vencer", color: "text-yellow-600 bg-yellow-600/10" };
  } else {
      return { estado: "Vigente", color: "text-green-600 bg-green-600/10" };
  }
}

const analizarStock = (stockRequerido, stockDisponible) => {
    const cantidadAPedir = Math.max(stockRequerido - stockDisponible, 0);
  
    const limiteExceso = stockRequerido * 1.25;
    const hayExceso = stockDisponible > limiteExceso;
    const hayFaltante = stockDisponible < stockRequerido;
  
    let estado = "";
    if (hayExceso) {
      estado = "⚠️ Exceso de stock";
    } else if (hayFaltante) {
      estado = "🔻 Stock bajo";
    }
  
    return {
      cantidadAPedir,
      hayExceso,
      hayFaltante,
      estado
    };
}
  
const formatDateCorte = (fechaISO) => {
  const fecha = new Date(fechaISO);

  const texto = fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  // Capitaliza el primer carácter
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export {
    formatDateLetters,
    formatDate,
    dateColombiaFormat,
    obtenerEstadoVencimiento,
    analizarStock,
    formatFechaCorte,
    formatDateCorte
}