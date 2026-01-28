
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
  if (!isoDate) return "";

  const [datePart] = isoDate.split("T"); // YYYY-MM-DD
  const [year, month, day] = datePart.split("-");

  return `${day}/${month}/${year}`;
};

const obtenerEstadoVencimiento = (fechaVencimientoStr) => {
  const hoy = new Date();
  const vencimiento = new Date(fechaVencimientoStr);
  const msEnUnDia = 1000 * 60 * 60 * 24;
  const diasRestantes = Math.ceil((vencimiento - hoy) / msEnUnDia);

  if (diasRestantes < 0) {
      return { estado: "Vencido", color: "text-red-600 bg-red-600/10" };
  } else if (diasRestantes <= 30) {
      return { estado: "Por vencer (crítico)", color: "text-orange-600 bg-orange-600/10" };
  } else if (diasRestantes <= 90) {
      return { estado: "Por vencer (moderado)", color: "text-yellow-600 bg-yellow-600/10" };
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
  
const formatDateCorte = (fecha) => {
  if (!fecha || typeof fecha !== "string") {
    return ""; // O algún valor por defecto, como "Fecha no disponible"
  }
  const [anio, mes] = fecha.split("-");
  if (!anio || !mes) {
    return ""; // En caso de que el split no dé resultado esperado
  }
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const nombreMes = meses[parseInt(mes, 10) - 1];
  return `${nombreMes} de ${anio}`;
};

function tiempoRelativoCreativo(fechaISO) {
    const ahora = new Date();
    const fecha = new Date(fechaISO);
    const diffMs = ahora - fecha;
    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSeg / 60);
    const diffHor = Math.floor(diffMin / 60);
    const diffDia = Math.floor(diffHor / 24);
    const diffMes = Math.floor(diffDia / 30);
    const diffAnio = Math.floor(diffDia / 365);

    if (diffSeg < 10) return "Justo ahora";
    if (diffSeg < 60) return `Hace ${diffSeg} segundo${diffSeg === 1 ? '' : 's'}`;
    if (diffMin === 1) return "Hace un minuto";
    if (diffMin < 60) return `Hace ${diffMin} minuto${diffMin === 1 ? '' : 's'}`;
    if (diffHor === 1) return "Hace una hora";
    if (diffHor < 24) return `Hace ${diffHor} hora${diffHor === 1 ? '' : 's'}`;
    if (diffDia === 1) return "Ayer";
    if (diffDia < 7) return `Hace ${diffDia} día${diffDia === 1 ? '' : 's'}`;
    if (diffDia < 30) {
        const semanas = Math.floor(diffDia / 7);
        return semanas === 1
            ? "Hace una semana"
            : `Hace ${semanas} semana${semanas === 1 ? '' : 's'}`;
    }
    if (diffMes === 1) return "Hace un mes";
    if (diffMes < 12) return `Hace ${diffMes} mes${diffMes === 1 ? '' : 'es'}`;
    if (diffAnio === 1) return "Hace un año";
    return `Hace ${diffAnio} años`;
}
const formatCantidad = (valor) => {
  if (valor === null || valor === undefined) return "0";

  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(valor);
};


export {
    formatDateLetters,
    formatDate,
    dateColombiaFormat,
    obtenerEstadoVencimiento,
    analizarStock,
    formatFechaCorte,
    formatDateCorte,
    tiempoRelativoCreativo,
    formatCantidad
}