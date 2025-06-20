import React from 'react';
import logo from '../assets/logo.svg';
import '../index.css';

export default function Header() {
  return (
    <header className="relative flex items-center justify-between px-4 py-3 shadow-md bg-honeydew">
      {/* Logo on the left */}
      <div className="flex items-center gap-3 z-10">
        <img src={logo} alt="Logo" className="h-15 w-15" />
      </div>

      {/* Centered Title */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-semibold font-montserrat text-chrysler-blue">
        Inference Engine
      </h1>

      {/* Right side spacer to keep layout balanced */}
      <div className="w-10 h-10 z-0" />
    </header>
  );
}
