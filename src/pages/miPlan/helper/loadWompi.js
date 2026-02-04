// utils/loadWompi.js
export function loadWompi() {
  return new Promise((resolve, reject) => {
    if (window.WidgetCheckout) return resolve(window.WidgetCheckout);

    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;

    script.onload = () => {
      if (window.WidgetCheckout) {
        resolve(window.WidgetCheckout);
      } else {
        reject("Wompi no se inicializó correctamente");
      }
    };

    script.onerror = () => reject("Error cargando Wompi");

    document.body.appendChild(script);
  });
}
