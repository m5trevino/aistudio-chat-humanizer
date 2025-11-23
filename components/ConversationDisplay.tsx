import React, { useCallback } from 'react';
import { Message } from '../types';

interface ConversationDisplayProps {
  messages: Message[];
  fileName: string | null;
}

const UserMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="col-start-1 col-end-12 md:col-start-3 rounded-lg">
    <div className="flex flex-col items-start">
      <div className="bg-sky-700 text-white p-4 rounded-xl shadow-md w-full">
        <h3 className="font-bold text-sky-200 border-b border-sky-500 pb-2 mb-2">--- START OF USER MESSAGE ---</h3>
        <pre className="whitespace-pre-wrap font-sans text-base">{text.trim()}</pre>
        <h3 className="font-bold text-sky-200 border-t border-sky-500 pt-2 mt-2">--- END OF USER MESSAGE ---</h3>
      </div>
    </div>
  </div>
);

const ModelMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="col-start-1 col-end-12 md:col-end-11 rounded-lg">
    <div className="flex flex-col items-start">
      <div className="bg-slate-700 text-slate-200 p-4 rounded-xl shadow-md w-full">
        <h3 className="font-bold text-slate-400 border-b border-slate-600 pb-2 mb-2">--- START OF CHATBOT MESSAGE ---</h3>
        <pre className="whitespace-pre-wrap font-sans text-base">{text.trim()}</pre>
        <h3 className="font-bold text-slate-400 border-t border-slate-600 pt-2 mt-2">--- END OF CHATBOT MESSAGE ---</h3>
      </div>
    </div>
  </div>
);

export const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ messages, fileName }) => {

  const handleSave = useCallback(() => {
    if (!messages || !fileName) return;

    const fileContent = messages.map(msg => {
      const startMarker = msg.role === 'user' ? '--- START OF USER MESSAGE ---' : '--- START OF CHATBOT MESSAGE ---';
      const endMarker = msg.role === 'user' ? '--- END OF USER MESSAGE ---' : '--- END OF CHATBOT MESSAGE ---';
      return `${startMarker}\n${msg.text.trim()}\n${endMarker}`;
    }).join('\n\n');

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const baseName = fileName.replace(/\.[^/.]+$/, "");
    link.download = `${baseName}_extracted.txt`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [messages, fileName]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow mt-8 bg-slate-800 rounded-lg border border-slate-700 shadow-2xl overflow-hidden" style={{maxHeight: '70vh'}}>
      <div className="flex justify-between items-center p-4 border-b border-slate-600 flex-shrink-0">
        <h2 className="text-lg font-bold text-slate-300 truncate pr-4" title={fileName ?? undefined}>
          {fileName ? `Conversation from: ${fileName}` : 'Extracted Conversation'}
        </h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Save as .txt</span>
        </button>
      </div>

      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
        <div className="grid grid-cols-12 gap-y-4">
          {messages.map((msg, index) => (
            msg.role === 'user' ? (
              <UserMessage key={index} text={msg.text} />
            ) : (
              <ModelMessage key={index} text={msg.text} />
            )
          ))}
        </div>
      </div>
    </div>
  );
};