import React from 'react';
import logo from '../assets/logo.svg';
import '../index.css';

export default function Header() {
  return (
    <header className="relative flex items-center justify-between px-4 py-3 shadow-md bg-honeydew">
      {/* Logo on the left */}
      <div className="flex items-center gap-3 z-10">
        <img
          src={logo}
          alt="Logo"
          className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain"
        />
      </div>

      {/* Centered Title */}
      <h1
        className="absolute left-1/2 transform -translate-x-1/2 font-montserrat font-semibold text-chrysler-blue-600 text-[clamp(1.25rem,4vw,2rem)] leading-snug whitespace-nowrap"
      >
        Regression Engine
      </h1>

      {/* Right side spacer to balance logo */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
    </header>
  );
}
