import { useState, useEffect, useCallback } from 'react';

// Define types for the Speech Recognition API
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      }
    }
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// List of supported Indian languages with their language codes
export const indianLanguages = [
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'pa-IN', name: 'Punjabi' },
  { code: 'ur-IN', name: 'Urdu' }
];

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  hasRecognitionSupport: boolean;
  currentLanguage: string;
  supportedLanguages: { code: string, name: string }[];
  startListening: () => void;
  stopListening: () => void;
  changeLanguage: (languageCode: string) => void;
}

// Check if browser supports SpeechRecognition
const getSpeechRecognition = (): SpeechRecognition | null => {
  if ('SpeechRecognition' in window) {
    return new (window as any).SpeechRecognition();
  } else if ('webkitSpeechRecognition' in window) {
    return new (window as any).webkitSpeechRecognition();
  }
  return null;
};

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en-US');
  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-IN', name: 'English (India)' },
    ...indianLanguages
  ];
  
  const hasRecognitionSupport = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  // Initialize speech recognition
  useEffect(() => {
    if (hasRecognitionSupport) {
      const recognitionInstance = getSpeechRecognition();
      
      if (recognitionInstance) {
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = currentLanguage;
        
        // Handle result event
        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const resultIndex = event.resultIndex;
          const transcript = event.results[resultIndex][0].transcript;
          setTranscript(transcript);
        };
        
        // Handle end event
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        // Handle error event
        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      }
    }
  }, [hasRecognitionSupport, currentLanguage]);

  // Change language function
  const changeLanguage = useCallback((languageCode: string) => {
    setCurrentLanguage(languageCode);
    if (recognition) {
      recognition.lang = languageCode;
    }
  }, [recognition]);

  // Start listening function
  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript('');
      setIsListening(true);
      recognition.lang = currentLanguage; // Set language before starting
      recognition.start();
    }
  }, [recognition, currentLanguage]);

  // Stop listening function
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return {
    transcript,
    isListening,
    hasRecognitionSupport,
    currentLanguage,
    supportedLanguages,
    startListening,
    stopListening,
    changeLanguage
  };
};
