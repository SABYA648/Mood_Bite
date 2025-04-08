'use client';

import React, { useState, useEffect } from 'react';

interface VoiceInputProps {
  transcription: string;
  setTranscription: React.Dispatch<React.SetStateAction<string>>;
  currentMood: string;
  setCurrentMood: React.Dispatch<React.SetStateAction<string>>;
  isRefineInputOpen: boolean;
  toggleRefineInput: () => void;
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

const VoiceInput: React.FC<VoiceInputProps> = ({
  transcription,
  setTranscription,
  currentMood,
  setCurrentMood,
  isRefineInputOpen,
  toggleRefineInput
}) => {
  const [isListening, setIsListening] = useState(false);

  const getMoodEmoji = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("spicy")) return "🔥";
    if (lowerText.includes("happy") || lowerText.includes("joy")) return "😊";
    if (lowerText.includes("sad") || lowerText.includes("down")) return "😔";
    if (lowerText.includes("hungry")) return "😋";
    if (lowerText.includes("tired")) return "😴";
    return "😊";
  };

  useEffect(() => {
    if (!isListening) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
      setCurrentMood(getMoodEmoji(transcript));
    };

    recognition.onerror = (e: any) => {
      console.error('Speech error:', e.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  return (
    <section className="px-4 py-16 mx-auto text-center max-w-[800px]">
      <h2 className="mb-4 text-6xl font-bold max-sm:text-4xl">
        <span className="flex flex-col text-red-700">Don't Choose</span>
        <span className="text-purple-600">Just Say It</span>
      </h2>

      <p className="flex flex-col mb-12 text-xl text-gray-600">
        <span>Your</span>
        <span className="text-red-700">mood is messy</span>
        <span>. Your food shouldn't be.</span>
        <span className="text-purple-600">Speak what you feel. We'll turn it into a meal.</span>
      </p>

      <div className="flex flex-col items-center gap-6">
        <button
          className="w-20 h-20 rounded-full shadow-md text-3xl"
          onClick={toggleListening}
          style={{ background: isListening ? '#ef4444' : '#3b82f6', color: 'white' }}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          🎤
        </button>
      </div>

      <div className="flex flex-col gap-4 items-center mt-6">
        <p className="text-base italic text-gray-500">You said: "{transcription}"</p>
        <div className="flex gap-2 items-center px-4 py-2 text-lg bg-gray-100 rounded-2xl">
          <span className="font-semibold">Mood Indicator:</span>
          <span className="text-2xl">{getMoodEmoji(transcription)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8 max-w-[500px] mx-auto">
        <button
          className="flex items-center justify-between px-6 py-3 bg-gray-100 rounded-xl"
          onClick={toggleRefineInput}
          aria-expanded={isRefineInputOpen}
        >
          <span className="text-xl font-semibold">Refine Input</span>
          <span
            className="transition-transform"
            style={{ transform: isRefineInputOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▼
          </span>
        </button>
        {isRefineInputOpen && (
          <div className="flex gap-4 items-center">
            <input
              className="flex-1 px-4 py-3 rounded-xl border border-solid"
              type="text"
              placeholder="Tell us what you feel, we'll turn it into a meal"
              onChange={(e) => {
                setTranscription(e.target.value);
                setCurrentMood(getMoodEmoji(e.target.value));
              }}
              value={transcription}
            />
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-xl"
              onClick={toggleRefineInput}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VoiceInput;