import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import logo from '../assets/logo.svg';
import '../index.css';

export default function Header({ currentPage, setCurrentPage }) {
    const [logoLoaded, setLogoLoaded] = useState(false);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const navClasses = (page) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-b-2 ${
            currentPage === page
                ? 'border-chrysler-blue-600 text-chrysler-blue-600'
                : 'border-transparent text-gray-600 hover:text-chrysler-blue-600 hover:border-chrysler-blue-600'
        }`;



    return (
        <nav className="bg-honeydew-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center h-auto py-3">
                    
                    {/* Center Logo and Title */}
                    <div className="flex justify-center items-center space-x-3 mb-2 md:mb-0">
                        <div className="relative">
                            {!logoLoaded && (
                                <Skeleton
                                    circle
                                    height={40}
                                    width={40}
                                    className="sm:h-12 sm:w-12 md:h-14 md:w-14"
                                />
                            )}
                            <img
                                src={logo}
                                alt="Logo"
                                onLoad={() => setLogoLoaded(true)}
                                className={`h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-opacity duration-300 ${
                                    logoLoaded ? 'opacity-100' : 'opacity-0 absolute'
                                }`}
                            />
                        </div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold font-montserrat text-chrysler-blue-600">
                            {logoLoaded ? (
                                <span>Regression Engine</span>
                            ) : (
                                <Skeleton width={180} height={28} />
                            )}
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex justify-center items-center space-x-6">
                        <button onClick={() => handlePageChange('home')} className={navClasses('home')}>
                            Home
                        </button>
                        <button onClick={() => handlePageChange('explore')} className={navClasses('explore')}>
                            Explore
                        </button>
                    </div>

                    {/* Mobile Navigation - Same as Desktop */}
                    <div className="md:hidden flex justify-center items-center space-x-6 mt-3">
                        <button onClick={() => handlePageChange('home')} className={navClasses('home')}>
                            Home
                        </button>
                        <button onClick={() => handlePageChange('explore')} className={navClasses('explore')}>
                            Explore
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}