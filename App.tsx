import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ConversationDisplay } from './components/ConversationDisplay';
import { Message, JsonData, Chunk } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const parseContent = useCallback((content: string) => {
    try {
      setError(null);
      const data: JsonData = JSON.parse(content);
      
      let chunks: Chunk[] | undefined;
      // The user's JSON has a specific structure: chunkedPrompt.chunks
      // This is a robust check for it.
      if (data && typeof data === 'object' && 'chunkedPrompt' in data && data.chunkedPrompt && 'chunks' in data.chunkedPrompt && Array.isArray(data.chunkedPrompt.chunks)) {
        chunks = data.chunkedPrompt.chunks;
      } else {
        throw new Error("Could not find a valid conversation structure ('chunkedPrompt.chunks') in the JSON file.");
      }

      const extractedMessages: Message[] = chunks
        .filter(chunk => (chunk.role === 'user' || chunk.role === 'model') && !chunk.isThought)
        .map(chunk => {
            let text = chunk.text;
            // If text is not on the chunk, try to build it from parts.
            if (typeof text !== 'string' && Array.isArray(chunk.parts)) {
              text = chunk.parts
                .filter(part => !part.thought && typeof part.text === 'string')
                .map(part => part.text)
                .join('');
            }
            return {
              role: chunk.role,
              text: text, // This can be undefined
            };
        })
        .filter((msg): msg is Message => typeof msg.text === 'string');

      if (extractedMessages.length === 0) {
        throw new Error("The file was parsed, but no user or model messages were found. Ensure the JSON structure contains 'text' or 'parts' for messages and 'isThought' is not true for all of them.");
      }

      setMessages(extractedMessages);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during parsing.';
      setError(`Failed to parse JSON file. Please ensure it's a valid chat log. Error: ${errorMessage}`);
      setMessages(null);
    }
  }, []);
  
  const handleFileSelect = useCallback((content: string, name: string) => {
      setFileName(name);
      parseContent(content);
  }, [parseContent]);


  const handleClear = useCallback(() => {
    setMessages(null);
    setError(null);
    setFileName(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-sky-400">Chat Log Verbatim Extractor</h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">Hey Vern! Upload your JSON file to strip out the bulk and see just the chat, verbatim.</p>
      </div>
      
      <FileUpload onFileSelect={handleFileSelect} onClear={handleClear} fileName={fileName} />

      {error && (
        <div className="w-full max-w-4xl mx-auto mt-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg" role="alert">
          <p className="font-bold">Parsing Error</p>
          <p>{error}</p>
        </div>
      )}

      {messages && messages.length > 0 && (
        <ConversationDisplay messages={messages} fileName={fileName} />
      )}

      {!messages && !error && (
         <div className="flex-grow flex items-center justify-center text-slate-600">
            <div className="text-center p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-xl">Your formatted conversation will appear here.</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;