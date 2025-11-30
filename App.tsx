import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { FileUploader } from './components/FileUploader';
import { PrintConfig } from './components/PrintConfig';
import { PaymentForm } from './components/PaymentForm';
import { About } from './components/About';
import { SqlSchema } from './components/SqlSchema';
import { DeploymentGuide } from './components/DeploymentGuide';
import { CheckCircle, Printer, Truck, FileText, Database, Server } from './components/Icons';
import { PrintSettings, PrintColor, PaperType, BindingType, UploadedFile, PaperSize, DeliveryMode } from './types';
import { PRICING, SIZE_MULTIPLIERS, DELIVERY_FEE, EXPRESS_FEE_PERCENTAGE } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'sql' | 'deploy'>('home');
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [settings, setSettings] = useState<PrintSettings>({
    copies: 1,
    pagesPerCopy: 1,
    doubleSided: false,
    colorMode: PrintColor.BlackAndWhite,
    paperType: PaperType.Standard,
    binding: BindingType.None,
    paperSize: PaperSize.A4,
    deliveryMode: DeliveryMode.Pickup,
    isExpress: false,
    specialInstructions: ''
  });
  const [totalCost, setTotalCost] = useState(0);
  const [orderInfo, setOrderInfo] = useState<{orderId: string, txnId: string} | null>(null);

  // Price Calculation Engine
  useEffect(() => {
    // 1. Base Cost per page (Color + Paper Type) * Size Multiplier
    const baseRate = PRICING[settings.colorMode];
    const paperRate = PRICING[settings.paperType];
    const sizeMult = SIZE_MULTIPLIERS[settings.paperSize];
    
    // Per page cost depends on size
    const perPageCost = (baseRate + paperRate) * sizeMult;
    
    const pages = settings.pagesPerCopy;
    
    // 2. Document total cost
    const docCost = (perPageCost * pages);
    
    // 3. Binding cost (per copy)
    const bindingRate = PRICING[settings.binding];

    // 4. Subtotal for all copies
    let subTotal = (docCost * settings.copies) + (bindingRate * settings.copies);

    // 5. Add Delivery Fee
    if (settings.deliveryMode === DeliveryMode.Delivery) {
        subTotal += DELIVERY_FEE;
    }

    // 6. Express Fee (Percentage of total)
    if (settings.isExpress) {
        subTotal = subTotal * (1 + EXPRESS_FEE_PERCENTAGE);
    }
    
    setTotalCost(parseFloat(subTotal.toFixed(2)));
  }, [settings]);

  const handleOrderSuccess = (txnId: string) => {
    setOrderInfo({
        orderId: Math.floor(Math.random() * 1000000).toString(),
        txnId: txnId
    });
    setStep(4);
    // In a real XAMPP app, this is where you'd clear cart or save order ID
  };

  const renderContent = () => {
    if (currentView === 'about') return <About />;
    if (currentView === 'sql') return <SqlSchema />;
    if (currentView === 'deploy') return <DeploymentGuide />;

    // Home / Order Flow
    switch(step) {
      case 1:
        return <FileUploader files={files} setFiles={setFiles} onNext={() => setStep(2)} />;
      case 2:
        return (
            <PrintConfig 
                settings={settings} 
                setSettings={setSettings} 
                onNext={() => setStep(3)} 
                onBack={() => setStep(1)}
                totalCost={totalCost}
            />
        );
      case 3:
        return (
            <PaymentForm 
                totalCost={totalCost} 
                onSuccess={handleOrderSuccess} 
                onBack={() => setStep(2)}
            />
        );
      case 4:
        return (
          <div className="text-center animate-in zoom-in duration-500 py-12">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                <CheckCircle className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Thank you for your payment. Your order has been placed successfully.
            </p>
            
            {/* Receipt Card */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl max-w-sm mx-auto mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <div className="flex justify-between items-start mb-4">
                    <div className="text-left">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Order ID</p>
                        <p className="text-white font-mono text-lg">#{orderInfo?.orderId}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Amount Paid</p>
                        <p className="text-white font-bold text-lg">₹{totalCost.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800 mb-4 text-left">
                     <p className="text-xs text-zinc-500 mb-1">Transaction Reference</p>
                     <p className="text-xs font-mono text-emerald-400 break-all flex items-center gap-1">
                        <CheckCircle size={10} /> {orderInfo?.txnId}
                     </p>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <Printer className="text-zinc-500" />
                    <div className="text-left">
                        <p className="text-white font-medium">Sending to Printer...</p>
                        <p className="text-xs text-zinc-500">Status: Queued</p>
                    </div>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3 animate-pulse" />
                </div>
                {settings.deliveryMode === DeliveryMode.Delivery && (
                   <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-2 text-sm text-indigo-400">
                       <div className="p-1 bg-indigo-500/10 rounded">
                        <Truck size={14} /> 
                       </div>
                       Home Delivery Scheduled
                   </div>
                )}
            </div>
            <button 
                onClick={() => {
                    setStep(1);
                    setFiles([]);
                    setSettings(prev => ({...prev, pagesPerCopy: 1, specialInstructions: '', isExpress: false}));
                }}
                className="text-white hover:underline opacity-80 hover:opacity-100 transition-opacity"
            >
                Start New Order
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Pass setView to Header, casting 'sql' back to 'home' | 'about' for the strict prop type or updating the prop type in Header */}
      {/* Ideally we update Header props, but for now we just handle 'home' and 'about' in header nav, and 'sql' is hidden/footer only */}
      <Header currentView={currentView as any} setView={setCurrentView} />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentView === 'home' && <StepIndicator currentStep={step} />}
        
        <div className="mt-8">
            {renderContent()}
        </div>
      </main>

      <footer className="border-t border-zinc-900 py-8 text-center text-zinc-600 text-sm">
        <p>&copy; {new Date().getFullYear()} MonoPrint Services. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4">
            <button 
                onClick={() => setCurrentView('sql')}
                className="flex items-center gap-1 hover:text-white transition-colors opacity-70 hover:opacity-100"
            >
                <Database size={12} /> Database Schema
            </button>
            <span className="opacity-30">|</span>
            <button 
                onClick={() => setCurrentView('deploy')}
                className="flex items-center gap-1 hover:text-white transition-colors opacity-70 hover:opacity-100"
            >
                <Server size={12} /> Deploy to XAMPP
            </button>
        </div>
      </footer>
    </div>
  );
};

export default App;