import React from 'react';
import { ShieldCheck, Printer, Zap } from './Icons';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Efficiency in <span className="text-zinc-500">Black & White</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
          MonoPrint is revolutionizing the printing industry with AI-powered analysis and automated workflows. 
          We deliver premium quality documents with speed and precision.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-colors text-center group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-white/10 group-hover:scale-110 transition-transform">
                <Printer className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-white font-bold text-lg mb-3">Premium Quality</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
                We use high-grade 80gsm+ paper stocks and laser precision for crisp, professional results every time.
            </p>
        </div>
        
        <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-colors text-center group">
            <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-3">Lightning Fast</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
                Our automated queuing system ensures your order is processed, printed, and packed in minutes.
            </p>
        </div>
        
        <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-colors text-center group">
             <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-3">Secure & Private</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
                Your files are encrypted during upload and automatically deleted from our servers post-printing.
            </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="border-t border-zinc-800 pt-16">
        <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="h-px w-12 bg-zinc-800"></div>
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Leadership Team</h2>
            <div className="h-px w-12 bg-zinc-800"></div>
        </div>
        
        <div className="flex justify-center">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-w-sm w-full hover:border-zinc-600 transition-colors group relative">
                <div className="h-80 overflow-hidden bg-zinc-800 relative">
                     {/* Professional Portrait */}
                    <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" 
                        alt="Amudhan" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80"></div>
                    
                    {/* Floating Name Card */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="text-3xl font-bold text-white mb-1">Amudhan</h3>
                        <p className="text-indigo-400 font-medium mb-4 flex items-center gap-2">
                            Founder & CEO
                        </p>
                        <p className="text-zinc-400 text-sm leading-relaxed border-t border-zinc-700 pt-4 mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            Visionary entrepreneur dedicated to modernizing the print industry through technology and user-centric design.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};