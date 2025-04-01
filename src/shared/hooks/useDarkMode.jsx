import { useEffect, useState, useRef } from "react";

export function useDarkMode() {
  const isDarkMode = useRef(localStorage.getItem("theme") === "dark"); // No provoca renders
  const [darkMode, setDarkMode] = useState(isDarkMode.current); // Estado inicial

  useEffect(() => {
    if (isDarkMode.current) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []); // Solo se ejecuta una vez al montar

  const toggleDarkMode = () => {
    const newMode = !isDarkMode.current;
    isDarkMode.current = newMode; // Actualizamos la referencia sin renderizar
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
    setDarkMode(newMode); // Solo cambia el estado si es necesario
  };

  return { darkMode, toggleDarkMode };
}
