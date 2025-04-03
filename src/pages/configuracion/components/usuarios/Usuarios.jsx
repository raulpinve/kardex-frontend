import React, { useState } from 'react';
import Button from '../../../../shared/components/Button';
import { LuChevronLeft, LuChevronRight, LuEraser, LuListFilter, LuLock, LuPencil, LuSearch } from 'react-icons/lu';
import ModalCrearUsuario from './ModalCrearUsuario';

const Usuarios = () => {
    const [isOpenModalCrearUsuario, setIsOpenModalCrearUsuario] = useState(false);

    return (
        <>
            <div className='mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]'>
                <div className='flex justify-between items-center'>
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90 py-1'>
                        Usuarios
                    </h3>
                    <div className='flex gap-2 items-center justify-between'>
                        <Button
                            type="button"
                            colorButton="secondary"
                            onClick={() => {
                                setIsOpenModalCrearUsuario(true)
                            }}
                        >   
                            <span>+</span>  Crear
                        </Button>
                        <div className="relative hidden xl:block">
                            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-200" />
                            <input 
                                type="text" 
                                placeholder="Buscar usuario..." 
                                className="pl-10 input-form"
                            />
                        </div>
                    </div>
                </div>
                <table className='min-w-full mt-3'>
                    <thead>
                        <tr className='border-gray-100 border-y  text-sm dark:border-gray-800 text-left'>
                            <th className='py-3'>
                                <p className='font-medium text-gray-500 dark:text-gray-400'>Nombres</p>
                            </th>
                            <th className='py-3'>
                                <p className='font-medium text-gray-500 dark:text-gray-400'>E-mail</p>
                            </th>
                            <th className='py-3'>
                                <p className='font-medium text-gray-500 dark:text-gray-400'>Username</p>
                            </th>
                            <th className='py-3'>
                                <p className='font-medium text-gray-500 dark:text-gray-400'>Rol</p>
                            </th>
                            <th className='py-3'>
                                <p className='font-medium text-gray-500 dark:text-gray-400'>Acciones</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100  text-sm dark:divide-gray-800'>
                        <tr>
                            <td className='py-3'>
                                <div className='items-center flex gap-3 rounded-full'>
                                    <img 
                                        src="https://picsum.photos/100"
                                        alt=""
                                        className='w-10 h-10 object-cover rounded-full'
                                    />
                                    <p className='text-gray-500 dark:text-gray-400'> Raúl Velásquez Pinto </p>
                                </div>
                            </td>
                            <td className='py-3'>
                                <p className='text-gray-500 dark:text-gray-400'> raulpinve@gmail.com </p>
                            </td>
                            <td className='py-3'>
                                <p className='text-gray-500 dark:text-gray-400'> raulpinve </p>
                            </td>
                            <td className='py-3'>
                                <p className='text-gray-500 dark:text-gray-400'> Editor </p>
                            </td>
                            <td className='py-3'>
                                <div className='text-gray-500 dark:text-gray-400 flex gap-2'>
                                    <button className='cursor-pointer'>
                                        <LuPencil />
                                    </button>
                                    <button className='cursor-pointer'>
                                        <LuLock  />
                                    </button>
                                    <button className='cursor-pointer'>
                                        <LuEraser />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>

                <nav className="flex items-center text-sm mt-4">
                    <a href="#" className="px-3 py-2 text-gray-500 hover:text-gray-700"><LuChevronLeft /></a>
                    <a href="#" className="px-3 py-2 font-semibold text-blue-600 border-b-2 border-blue-600">1</a>
                    <a href="#" className="px-3 py-2 text-gray-500 hover:text-gray-700">2</a>
                    <a href="#" className="px-3 py-2 text-gray-500 hover:text-gray-700">3</a>
                    <span className="px-3 py-2 text-gray-500">...</span>
                    <a href="#" className="px-3 py-2 text-gray-500 hover:text-gray-700">8</a>
                    <a href="#" className="px-3 py-2 text-gray-500 hover:text-gray-700"><LuChevronRight /></a>
                </nav>
            </div>
            <ModalCrearUsuario 
                isOpenModal = {isOpenModalCrearUsuario}
                setIsOpenModal = {setIsOpenModalCrearUsuario}
            />
        </>
    );
};

export default Usuarios;