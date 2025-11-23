import React, { useCallback, useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void;
  onClear: () => void;
  fileName: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onClear, fileName }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelect(content, file.name);
    };
    reader.readAsText(file);
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onClearClick = () => {
    if (inputRef.current) {
        inputRef.current.value = "";
    }
    onClear();
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {!fileName ? (
        <label
          htmlFor="dropzone-file"
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${dragActive ? 'border-sky-400 bg-slate-800' : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800'}`}
        >
          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className="absolute top-0 left-0 w-full h-full"></div>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
            <svg className="w-10 h-10 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-slate-500">JSON chat log file</p>
          </div>
          <input ref={inputRef} id="dropzone-file" type="file" className="hidden" onChange={handleChange} accept=".json,application/json" />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className='flex items-center space-x-3 overflow-hidden'>
                <svg className='w-6 h-6 text-green-400 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
                <p className="font-mono text-slate-300 truncate">{fileName}</p>
            </div>
            <button
                onClick={onClearClick}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex-shrink-0"
            >
                Clear
            </button>
        </div>
      )}
    </div>
  );
};
