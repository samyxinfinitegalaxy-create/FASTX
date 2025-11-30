import React, { useState } from 'react';
import { Upload, FileText, Trash2, Sparkles, Loader2 } from './Icons';
import { UploadedFile } from '../types';
import { analyzeDocument } from '../services/geminiService';

interface FileUploaderProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  onNext: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ files, setFiles, onNext }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null); // ID of file being analyzed

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await processFiles(Array.from(event.target.files));
    }
  };

  const processFiles = async (fileList: File[]) => {
    const newFiles: UploadedFile[] = [];

    for (const file of fileList) {
      // Convert to base64 for preview and analysis
      const reader = new FileReader();
      
      const filePromise = new Promise<UploadedFile>((resolve) => {
        reader.onload = async (e) => {
          const base64 = e.target?.result as string;
          const pureBase64 = base64.split(',')[1];
          const id = Math.random().toString(36).substring(7);

          const newFile: UploadedFile = {
            id,
            name: file.name,
            size: file.size,
            previewUrl: file.type.startsWith('image/') ? base64 : null,
            base64Data: pureBase64
          };
          resolve(newFile);
        };
        reader.readAsDataURL(file);
      });
      
      newFiles.push(await filePromise);
    }

    setFiles(prev => [...prev, ...newFiles]);
    
    // Auto-trigger analysis for first file if not done
    if (newFiles.length > 0) {
      runGeminiAnalysis(newFiles[0]);
    }
  };

  const runGeminiAnalysis = async (file: UploadedFile) => {
    setAnalyzing(file.id);
    const result = await analyzeDocument(file.base64Data);
    setAnalyzing(null);

    if (result) {
      setFiles(prev => prev.map(f => {
        if (f.id === file.id) {
            let suggestionText = `Detected: ${result.summary}. `;
            if (result.suggestedPaper) suggestionText += `Suggest: ${result.suggestedPaper}. `;
            return { ...f, analysis: suggestionText };
        }
        return f;
      }));
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging ? 'border-white bg-zinc-900' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-600'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          processFiles(Array.from(e.dataTransfer.files));
        }}
      >
        <input 
          type="file" 
          multiple 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800">
            <Upload className="w-8 h-8 text-zinc-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-white">Drop your documents here</p>
            <p className="text-sm text-zinc-500 mt-1">PDF, JPG, PNG supported</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map(file => (
            <div key={file.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-zinc-950 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-800">
                  {file.previewUrl ? (
                    <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="text-zinc-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white truncate max-w-[200px]">{file.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">{formatSize(file.size)}</span>
                    {analyzing === file.id ? (
                        <div className="flex items-center text-xs text-indigo-400">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analyzing...
                        </div>
                    ) : file.analysis ? (
                        <div className="flex items-center text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                            <Sparkles className="w-3 h-3 mr-1" /> Smart Analysis
                        </div>
                    ) : (
                         <button 
                            onClick={() => runGeminiAnalysis(file)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                         >
                            <Sparkles className="w-3 h-3 mr-1" /> Analyze
                         </button>
                    )}
                  </div>
                  {file.analysis && !analyzing && (
                      <p className="text-xs text-zinc-400 mt-1 max-w-sm">{file.analysis}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => removeFile(file.id)}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 text-zinc-600 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={files.length === 0}
          className={`
            px-8 py-3 rounded-xl font-medium transition-all duration-300
            ${files.length > 0 
              ? 'bg-white text-black hover:bg-zinc-200' 
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
          `}
        >
          Continue to Settings
        </button>
      </div>
    </div>
  );
};