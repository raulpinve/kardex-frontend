import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(() => {
        if (typeof window !== "undefined") {
            const savedState = localStorage.getItem("sidebarOpen");
            return savedState !== null ? JSON.parse(savedState) : window.innerWidth >= 1024;
        }
        return true; // Valor por defecto en SSR
    });
    
    React.useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(prev => {
                if (window.innerWidth < 1024) {
                    return false;
                }
                return prev; // Mantiene el estado guardado
            });
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    React.useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-x-hidden">
                <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
            </div>
        </div>
    );
};

export default Layout;