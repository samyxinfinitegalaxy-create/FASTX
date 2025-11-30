import React from 'react';
import { CheckCircle } from './Icons';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = ['Upload', 'Settings', 'Payment', 'Done'];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div key={step} className="flex items-center">
              <div 
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 
                  transition-all duration-300
                  ${isActive ? 'border-white bg-white text-black' : ''}
                  ${isCompleted ? 'border-zinc-700 bg-zinc-800 text-zinc-400' : ''}
                  ${!isActive && !isCompleted ? 'border-zinc-800 text-zinc-600' : ''}
                `}
              >
                {isCompleted ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              <span className={`ml-2 text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className="w-12 h-px bg-zinc-800 mx-4 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};