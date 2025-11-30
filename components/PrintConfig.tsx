import React from 'react';
import { PrintSettings, PrintColor, PaperType, BindingType, PaperSize, DeliveryMode } from '../types';
import { PRICING, SIZE_MULTIPLIERS, DELIVERY_FEE, EXPRESS_FEE_PERCENTAGE } from '../constants';
import { Truck, MapPin, Clock, AlertCircle, Scissors } from './Icons';

interface PrintConfigProps {
  settings: PrintSettings;
  setSettings: React.Dispatch<React.SetStateAction<PrintSettings>>;
  onNext: () => void;
  onBack: () => void;
  totalCost: number;
}

export const PrintConfig: React.FC<PrintConfigProps> = ({ 
  settings, setSettings, onNext, onBack, totalCost 
}) => {
  
  const updateSetting = <K extends keyof PrintSettings>(key: K, value: PrintSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const expressCost = settings.isExpress ? (totalCost / (1 + EXPRESS_FEE_PERCENTAGE)) * EXPRESS_FEE_PERCENTAGE : 0;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Settings Form */}
      <div className="flex-1 space-y-8">
        
        {/* Core Settings Section */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-zinc-400" /> Print Specification
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pages Input */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Total Pages per File</label>
                    <input 
                        type="number" 
                        min="1"
                        value={settings.pagesPerCopy}
                        onChange={(e) => updateSetting('pagesPerCopy', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                    />
                </div>
                
                {/* Paper Size */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Paper Size</label>
                    <div className="flex bg-zinc-950 rounded-xl border border-zinc-700 p-1">
                        {Object.values(PaperSize).map((size) => (
                            <button
                                key={size}
                                onClick={() => updateSetting('paperSize', size)}
                                className={`
                                    flex-1 py-2 rounded-lg text-sm font-medium transition-all
                                    ${settings.paperSize === size ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}
                                `}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Color Mode */}
            <div>
                <label className="text-sm font-medium text-zinc-400 block mb-3">Color Mode</label>
                <div className="grid grid-cols-2 gap-4">
                {Object.values(PrintColor).map((mode) => (
                    <button
                    key={mode}
                    onClick={() => updateSetting('colorMode', mode)}
                    className={`
                        p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2
                        ${settings.colorMode === mode 
                        ? 'border-white bg-zinc-900 text-white' 
                        : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-700'}
                    `}
                    >
                    <div className={`w-6 h-6 rounded-full border border-zinc-600 ${mode === PrintColor.BlackAndWhite ? 'bg-zinc-400' : 'bg-gradient-to-br from-red-500 via-green-500 to-blue-500'}`} />
                    <span className="font-medium">{mode}</span>
                    <span className="text-xs opacity-60">+₹{PRICING[mode].toFixed(2)}/pg</span>
                    </button>
                ))}
                </div>
            </div>

            {/* Paper & Binding Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-medium text-zinc-400 block mb-3">Paper Type</label>
                    <select 
                        value={settings.paperType}
                        onChange={(e) => updateSetting('paperType', e.target.value as PaperType)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white appearance-none cursor-pointer"
                    >
                        {Object.values(PaperType).map((type) => (
                            <option key={type} value={type}>
                                {type} (+₹{PRICING[type].toFixed(2)})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-zinc-400 block mb-3">Binding</label>
                    <select 
                        value={settings.binding}
                        onChange={(e) => updateSetting('binding', e.target.value as BindingType)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white appearance-none"
                    >
                        {Object.values(BindingType).map((type) => (
                            <option key={type} value={type}>
                                {type} (+₹{PRICING[type].toFixed(2)})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Copies & Double Sided */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                 <div className="w-full md:w-auto">
                     <label className="text-sm font-medium text-zinc-400 block mb-3">Copies</label>
                     <div className="flex items-center bg-zinc-900 rounded-xl border border-zinc-800 p-1">
                        <button 
                            className="w-12 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                            onClick={() => updateSetting('copies', Math.max(1, settings.copies - 1))}
                        >-</button>
                        <span className="w-16 text-center font-mono font-bold">{settings.copies}</span>
                        <button 
                            className="w-12 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                            onClick={() => updateSetting('copies', settings.copies + 1)}
                        >+</button>
                     </div>
                </div>
                
                <div className="flex-1 w-full pt-6 md:pt-0">
                    <label className="flex items-center gap-3 p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition-colors">
                        <input 
                            type="checkbox"
                            checked={settings.doubleSided}
                            onChange={(e) => updateSetting('doubleSided', e.target.checked)}
                            className="w-5 h-5 rounded border-zinc-600 bg-zinc-950 text-white focus:ring-offset-zinc-900 accent-white"
                        />
                        <span className="text-sm font-medium text-zinc-300">
                            Double-sided printing <span className="text-zinc-500">(Save Paper)</span>
                        </span>
                    </label>
                </div>
            </div>
        </div>

        {/* Advanced Options Section */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-zinc-400" /> Delivery & Instructions
            </h3>

            {/* Delivery Toggle */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => updateSetting('deliveryMode', DeliveryMode.Pickup)}
                    className={`
                        p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all
                        ${settings.deliveryMode === DeliveryMode.Pickup ? 'border-white bg-zinc-900 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}
                    `}
                >
                    <MapPin className="w-5 h-5" />
                    <div className="text-left">
                        <div className="font-bold">Store Pickup</div>
                        <div className="text-xs opacity-70">Ready in 2 hrs</div>
                    </div>
                </button>
                <button
                    onClick={() => updateSetting('deliveryMode', DeliveryMode.Delivery)}
                    className={`
                        p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all
                        ${settings.deliveryMode === DeliveryMode.Delivery ? 'border-white bg-zinc-900 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}
                    `}
                >
                    <Truck className="w-5 h-5" />
                    <div className="text-left">
                        <div className="font-bold">Home Delivery</div>
                        <div className="text-xs opacity-70">+₹{DELIVERY_FEE} Flat Fee</div>
                    </div>
                </button>
            </div>

            {/* Special Instructions */}
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Special Instructions (Optional)</label>
                <textarea 
                    value={settings.specialInstructions}
                    onChange={(e) => updateSetting('specialInstructions', e.target.value)}
                    placeholder="e.g. Cut edges, do not staple first page, call upon arrival..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors h-24 resize-none"
                />
            </div>
        </div>

        <div className="flex justify-between pt-4">
            <button 
                onClick={onBack}
                className="px-6 py-3 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
                Back
            </button>
            <button 
                onClick={onNext}
                className="px-8 py-3 rounded-xl font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
            >
                Proceed to Payment
            </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="lg:w-96">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            
            {/* Express Toggle */}
            <div className={`
                mb-6 p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all
                ${settings.isExpress ? 'bg-amber-500/10 border-amber-500/50' : 'bg-zinc-950 border-zinc-800'}
            `}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.isExpress ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                        <Clock className="w-4 h-4" />
                    </div>
                    <div>
                        <div className={`font-bold text-sm ${settings.isExpress ? 'text-amber-400' : 'text-zinc-400'}`}>Express Priority</div>
                        <div className="text-xs text-zinc-500">Skip the queue (+20%)</div>
                    </div>
                </div>
                <div className="relative inline-block w-10 h-6 align-middle select-none">
                    <input 
                        type="checkbox" 
                        checked={settings.isExpress}
                        onChange={(e) => updateSetting('isExpress', e.target.checked)}
                        className="sr-only"
                    /> 
                    <div onClick={() => updateSetting('isExpress', !settings.isExpress)} className={`block w-10 h-6 rounded-full cursor-pointer transition-colors ${settings.isExpress ? 'bg-amber-500' : 'bg-zinc-700'}`}></div>
                    <div onClick={() => updateSetting('isExpress', !settings.isExpress)} className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.isExpress ? 'transform translate-x-4' : ''}`}></div>
                </div>
            </div>

            <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex justify-between">
                    <span>Base Cost ({settings.colorMode}, {settings.paperSize})</span>
                    <span>₹{(PRICING[settings.colorMode] * SIZE_MULTIPLIERS[settings.paperSize]).toFixed(2)}/pg</span>
                </div>
                <div className="flex justify-between">
                    <span>Paper ({settings.paperType.split(' ')[0]})</span>
                    <span>+₹{PRICING[settings.paperType].toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Binding</span>
                    <span>+₹{PRICING[settings.binding].toFixed(2)}</span>
                </div>
                <div className="h-px bg-zinc-800 my-2" />
                <div className="flex justify-between text-zinc-300">
                    <span>Pages x Copies</span>
                    <span>{settings.pagesPerCopy} x {settings.copies}</span>
                </div>
                
                {settings.deliveryMode === DeliveryMode.Delivery && (
                    <div className="flex justify-between text-indigo-400">
                        <span className="flex items-center gap-1"><Truck className="w-3 h-3"/> Delivery Fee</span>
                        <span>+₹{DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                )}
                
                {settings.isExpress && (
                     <div className="flex justify-between text-amber-500">
                        <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Express Fee</span>
                        <span>+₹{expressCost.toFixed(2)}</span>
                    </div>
                )}

                <div className="h-px bg-zinc-800 my-2" />
                <div className="flex justify-between text-xl font-bold text-white mt-4">
                    <span>Total</span>
                    <span>₹{totalCost.toFixed(2)}</span>
                </div>
                <p className="text-xs text-zinc-600 mt-4 text-center">
                    Prices include taxes. {settings.deliveryMode === DeliveryMode.Delivery ? 'Delivering to address on file.' : 'Please pickup at counter.'}
                </p>
            </div>
        </div>
      </div>

    </div>
  );
};