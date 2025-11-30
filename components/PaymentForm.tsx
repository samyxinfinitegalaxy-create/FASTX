import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, RefreshCw, Wifi, ShieldCheck, Smartphone, AlertCircle, Zap, WalletCards } from './Icons';
import { PAYMENT_CONFIG } from '../constants';

interface PaymentFormProps {
  totalCost: number;
  onSuccess: (txnId: string) => void;
  onBack: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ totalCost, onSuccess, onBack }) => {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'confirmed' | 'expired'>('idle');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [upiRef, setUpiRef] = useState('');
  const [error, setError] = useState('');

  // Format the payment data string (UPI Standard)
  const paymentData = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${encodeURIComponent(PAYMENT_CONFIG.payeeName)}&am=${totalCost.toFixed(2)}&cu=INR&tn=Order_${Math.floor(Math.random() * 10000)}`;
  
  // Dynamic QR Code generation API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentData)}&bgcolor=ffffff`;

  // Timer for QR Expiry
  useEffect(() => {
    if (status === 'confirmed') return; // Stop timer if confirmed

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
            setStatus('expired');
            return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Handler for user triggering the verification
  const handleVerifyPayment = () => {
    if (status !== 'idle') return;

    if (!upiRef || upiRef.length < 12) {
        setError('Please enter a valid 12-digit UPI Reference No.');
        return;
    }
    setError('');

    // Start the simulation sequence
    setStatus('verifying');
            
    // 1. Verifying signature with Bank (Simulated delay: 2.5 seconds)
    setTimeout(() => {
        setStatus('confirmed');
        
        // 2. Place order automatically (Delay: 1.5 seconds)
        setTimeout(() => {
            onSuccess(upiRef); // Pass the ORIGINAL ID entered by user
        }, 1500);

    }, 2500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStatusMessage = () => {
    switch(status) {
        case 'idle':
            return (
                <div className="flex items-center justify-center gap-3 text-zinc-400">
                    <Wifi className="w-5 h-5 animate-pulse" />
                    <span>Waiting for Transaction Details...</span>
                </div>
            );
        case 'verifying':
            return (
                <div className="flex items-center justify-center gap-3 text-amber-400 font-medium">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Ref No: {upiRef}...</span>
                </div>
            );
        case 'confirmed':
            return (
                <div className="flex flex-col items-center justify-center gap-1 text-emerald-400 font-bold">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6" />
                        <span>Payment Verified!</span>
                    </div>
                </div>
            );
        case 'expired':
            return (
                <div className="flex items-center justify-center gap-3 text-red-400 font-medium">
                    <AlertCircle className="w-5 h-5" />
                    <span>Session Expired</span>
                </div>
            );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Active Status Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500 ${status === 'confirmed' ? 'bg-emerald-500' : status === 'expired' ? 'bg-red-500' : status === 'verifying' ? 'bg-amber-500 animate-pulse' : 'bg-zinc-800'}`} />

        <div className="mb-6 mt-2 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <WalletCards className="w-6 h-6 text-amber-400" />
            FamPay Scan
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">Scan QR & Enter Reference No.</p>
        </div>

        {/* Amount Display */}
        <div className="mb-6 bg-zinc-950/80 px-8 py-4 rounded-2xl border border-zinc-800">
            <span className="text-4xl font-bold text-white tracking-tight">
                ₹{totalCost.toFixed(2)}
            </span>
            <span className="text-zinc-500 ml-2 font-medium">INR</span>
        </div>

        {/* QR Code Container */}
        <div className="relative group mb-6">
            <div className={`absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-xl blur transition duration-1000 ${status === 'idle' ? 'opacity-30' : 'opacity-70 animate-pulse'}`}></div>
            <div className="relative bg-white p-4 rounded-xl shadow-inner">
                {status === 'expired' ? (
                     <div className="w-48 h-48 flex flex-col items-center justify-center text-zinc-400">
                        <AlertCircle className="w-12 h-12 mb-2 text-red-500" />
                        <span className="text-xs font-medium text-red-500">QR Expired</span>
                     </div>
                ) : (
                    <img 
                        src={qrUrl} 
                        alt="Payment QR Code" 
                        className={`w-48 h-48 object-contain transition-opacity duration-500 ${status === 'confirmed' ? 'opacity-20' : 'opacity-100'}`}
                    />
                )}
                
                {status === 'confirmed' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle className="w-20 h-20 text-emerald-500 drop-shadow-lg scale-125 animate-in zoom-in duration-300" />
                    </div>
                )}
            </div>
        </div>

        {/* Paying details & Timer */}
        <div className="w-full flex items-center justify-between text-xs text-zinc-500 font-mono mb-6">
            <div className="flex items-center gap-1.5">
                <Smartphone className="w-3 h-3" />
                <span className="max-w-[150px] truncate">{PAYMENT_CONFIG.upiId}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                <span className={timeLeft < 60 ? "text-red-400" : "text-zinc-400"}>
                    Exp: {formatTime(timeLeft)}
                </span>
            </div>
        </div>

        {/* Dynamic Status Indicator */}
        <div className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 mb-4 flex items-center justify-center transition-colors ${status === 'expired' ? 'border-red-900/50 bg-red-900/10' : ''}`}>
            {renderStatusMessage()}
        </div>

        {/* Manual UTR Entry Input */}
        {status === 'idle' && (
            <div className="w-full space-y-3 mb-4 animate-in slide-in-from-bottom-2">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Enter 12-digit UPI Ref No."
                        value={upiRef}
                        onChange={(e) => {
                            // Only allow numbers
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setUpiRef(val);
                            if(val.length > 0) setError('');
                        }}
                        maxLength={12}
                        className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 text-center tracking-widest font-mono placeholder:tracking-normal transition-colors"
                    />
                </div>
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                
                <button
                    onClick={handleVerifyPayment}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!upiRef}
                >
                    <ShieldCheck className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                    <span>Verify Transaction</span>
                </button>
            </div>
        )}

        {/* Buttons based on status */}
        {status === 'idle' && (
            <button 
                onClick={onBack}
                className="mt-2 text-zinc-500 text-sm hover:text-white transition-colors"
            >
                Cancel Order
            </button>
        )}

        {status === 'expired' && (
            <button 
                onClick={() => {
                    setStatus('idle');
                    setTimeLeft(300);
                    setUpiRef('');
                }}
                className="mt-4 bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
                Generate New QR
            </button>
        )}

      </div>
      
      <p className="text-center text-zinc-600 text-xs mt-6">
        <ShieldCheck className="w-3 h-3 inline-block mr-1" />
        Secured by FamPay Gateway Integration.
      </p>
    </div>
  );
};