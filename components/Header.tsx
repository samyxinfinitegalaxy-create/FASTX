import React from 'react';
import { Printer, Users, LayoutGrid } from './Icons';

interface HeaderProps {
  currentView: 'home' | 'about';
  setView: (view: 'home' | 'about') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => (
  <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setView('home')}
      >
        <div className="bg-white p-1.5 rounded-lg">
          <Printer className="w-6 h-6 text-black" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">MonoPrint</span>
      </div>
      
      <nav className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
        <button
            onClick={() => setView('home')}
            className={`
                px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${currentView === 'home' 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}
            `}
        >
            <LayoutGrid size={16} />
            <span className="hidden sm:inline">Order Now</span>
        </button>
        <button
            onClick={() => setView('about')}
            className={`
                px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${currentView === 'about' 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}
            `}
        >
            <Users size={16} />
            <span className="hidden sm:inline">About Team</span>
        </button>
      </nav>
    </div>
  </header>
);