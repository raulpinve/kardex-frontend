import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

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
                return prev; 
            });
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    React.useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen overflow-hidden min-w-0">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-x-hidden  overflow-y-scroll  min-w-0">
                <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
                <div className='px-3 lg:px-8 py-4  w-full min-w-0 2xl:max-w-[1536px] mx-auto'> 
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default Layout;