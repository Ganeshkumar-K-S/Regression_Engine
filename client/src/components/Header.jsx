import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import logo from '../assets/logo.svg';
import '../index.css';

export default function Header({ currentPage, setCurrentPage }) {
    const [logoLoaded, setLogoLoaded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const navClasses = (page, isMobile = false) =>
        `block ${
            isMobile ? 'text-left w-full' : 'inline-block'
        } py-2 px-5 rounded-xl text-sm font-medium transition-all duration-200 ${
            currentPage === page
                ? 'bg-chrysler-blue-600 text-white font-semibold shadow-md'
                : 'text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
        }`;

    return (
        <nav className="bg-honeydew-600 shadow-md sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between py-4">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            {!logoLoaded && (
                                <Skeleton
                                    circle
                                    height={48}
                                    width={48}
                                    className="sm:h-12 sm:w-12 md:h-14 md:w-14"
                                />
                            )}
                            <img
                                src={logo}
                                alt="Logo"
                                onLoad={() => setLogoLoaded(true)}
                                className={`h-12 w-12 sm:h-14 sm:w-14 object-contain transition-opacity duration-300 ${
                                    logoLoaded ? 'opacity-100' : 'opacity-0 absolute'
                                }`}
                            />
                        </div>
                        {logoLoaded ? (
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-chrysler-blue-600 font-montserrat">
                                Regression Engine
                            </h1>
                        ) : (
                            <Skeleton width={180} height={28} />
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded-lg md:hidden hover:bg-gray-200 transition-all"
                        aria-controls="navbar-default"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => handlePageChange('home')} className={navClasses('home')}>
                            Home
                        </button>
                        <button onClick={() => handlePageChange('explore')} className={navClasses('explore')}>
                            Explore
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-2">
                        {/* Centered Title
                        <div className="mb-4 flex justify-center">
                            {logoLoaded ? (
                                <h1 className="text-xl font-bold text-chrysler-blue-600 font-montserrat text-center">
                                    Regression Engine
                                </h1>
                            ) : (
                                <Skeleton width={180} height={28} />
                            )}
                        </div> */}

                        {/* Mobile Menu Items */}
                        <ul className="flex flex-col p-2 space-y-1">
                            <li>
                                <button
                                    onClick={() => handlePageChange('home')}
                                    className={navClasses('home', true)}
                                >
                                    Home
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handlePageChange('explore')}
                                    className={navClasses('explore', true)}
                                >
                                    Explore
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}
