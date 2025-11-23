export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Chunk {
  text?: string;
  role: 'user' | 'model';
  isThought?: boolean;
  parts?: { text: string; thought?: boolean }[];
  // other properties can exist but are not needed
}

export interface JsonData {
  chunkedPrompt?: {
    chunks?: Chunk[];
  };
  // other properties can exist but are not needed
}
