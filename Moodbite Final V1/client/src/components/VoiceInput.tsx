import { FC, useState, useEffect } from 'react';
import { useSpeechRecognition } from '@/utils/speechRecognition';
import { useMoodAnalysis } from '@/hooks/use-mood-analysis';
import { useAdvancedFoodRequest } from '@/hooks/use-advanced-food-request';
import { getMoodDetails } from '@/utils/moodDetector';
import { useColorContext } from '@/contexts/ColorContext';
import type { MoodAnalysisResult } from '@/hooks/use-mood-analysis';
import type { AdvancedFoodRequestResult } from '@/hooks/use-advanced-food-request';

interface VoiceInputProps {
  onTranscriptionComplete: (text: string, analysisResult: MoodAnalysisResult) => void;
  onAdvancedAnalysisComplete?: (text: string, analysisResult: AdvancedFoodRequestResult) => void;
  useAdvancedNLP?: boolean;
}

const VoiceInput: FC<VoiceInputProps> = ({ 
  onTranscriptionComplete, 
  onAdvancedAnalysisComplete, 
  useAdvancedNLP: initialAdvancedNLP = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isComplexRequest, setIsComplexRequest] = useState<boolean>(false);
  // State for advanced NLP toggle
  const [useAdvancedNLP, setUseAdvancedNLP] = useState<boolean>(initialAdvancedNLP);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    hasRecognitionSupport,
    currentLanguage,
    supportedLanguages,
    changeLanguage
  } = useSpeechRecognition();
  
  // State for language selector
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);
  
  const moodAnalysisMutation = useMoodAnalysis();
  const advancedFoodRequestMutation = useAdvancedFoodRequest();
  const { updatePalette, applyGradientStyle } = useColorContext();

  // Store the last analyzed transcript to prevent duplicate analysis
  const [lastAnalyzedTranscript, setLastAnalyzedTranscript] = useState<string>('');
  
  // Handle voice input completion
  useEffect(() => {
    // Only analyze if transcript is new, not empty, not currently analyzing, and voice input has stopped
    if (transcript && 
        !isListening && 
        transcript.trim() !== '' && 
        !isAnalyzing && 
        transcript !== lastAnalyzedTranscript) {
      
      // Cache the current transcript to prevent duplicate analysis
      setLastAnalyzedTranscript(transcript);
      
      // Check if this is a complex request
      const isComplex = isComplexFoodRequest(transcript);
      setIsComplexRequest(isComplex);
      
      // Process based on complexity
      if (isComplex && useAdvancedNLP && onAdvancedAnalysisComplete) {
        analyzeComplexInput(transcript);
      } else {
        analyzeInput(transcript);
      }
    }
  }, [transcript, isListening, isAnalyzing, useAdvancedNLP, onAdvancedAnalysisComplete, lastAnalyzedTranscript]);
  
  // Checks if a text contains complex food request patterns
  const isComplexFoodRequest = (text: string): boolean => {
    const complexPatterns = [
      /with(out)?\s+[a-z\s,]+/, // ingredients with/without
      /no\s+[a-z\s,]+/, // no [ingredient]
      /(low|high)\s+(calorie|carb|protein|fat)/, // nutritional focus
      /(gluten|dairy|nut)\s+free/, // allergens
      /diet(ary)?\s+restriction/, // dietary restrictions
      /(vegan|vegetarian|pescatarian)/, // diet types
      /for\s+(date|party|gathering|occasion)/, // occasions
      /(crispy|crunchy|soft|tender|juicy)/, // textures
      /(baked|fried|grilled|roasted)/, // cooking methods
      /under\s+\d+\s+(calorie|minute)/, // constraints
      /\d+\s+minute/, // time constraints
      /local\s+restaurant/, // location preferences
      /best\s+rated/, // quality preferences
      /cost(s)?\s+less\s+than/, // price constraints
    ];
    
    text = text.toLowerCase();
    
    // Check if any complex pattern is matched
    return complexPatterns.some(pattern => pattern.test(text)) || 
           text.split(' ').length > 8; // Also consider longer requests as complex
  };
  
  // Function to analyze regular input using the OpenAI mood service
  const analyzeInput = async (text: string) => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await moodAnalysisMutation.mutateAsync(text);
      
      // Update the color palette based on the detected mood
      updatePalette(result.mood);
      
      onTranscriptionComplete(text, result);
    } catch (error) {
      console.error('Error analyzing mood:', error);
      // Fallback to basic mood detection if API fails
      const basicMoodDetails = getMoodDetails('neutral');
      
      // Default to neutral mood palette
      updatePalette('neutral');
      
      onTranscriptionComplete(text, {
        mood: 'neutral',
        foodSuggestions: [],
        dietary: { isVeg: false, isEgg: false, isNonVeg: false },
        sortPreference: 'Relevance',
        filteredItems: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Function to analyze complex food requests using the advanced NLP service
  const analyzeComplexInput = async (text: string) => {
    if (!text.trim() || !onAdvancedAnalysisComplete) return;
    
    setIsAnalyzing(true);
    try {
      const result = await advancedFoodRequestMutation.mutateAsync(text);
      
      // Update the color palette based on the detected mood from advanced analysis
      updatePalette(result.mood);
      
      // Call the advanced analysis callback
      onAdvancedAnalysisComplete(text, result);
      
      // Also call the regular callback with the mood info from the advanced analysis
      // This ensures compatibility with components that only use the basic mood analysis
      onTranscriptionComplete(text, {
        mood: result.mood,
        foodSuggestions: result.foodSuggestions,
        dietary: {
          isVeg: result.complexAnalysis.dietaryRestrictions.includes('vegetarian'),
          isEgg: result.complexAnalysis.dietaryRestrictions.includes('egg'),
          isNonVeg: result.complexAnalysis.dietaryRestrictions.some(r => 
            ['non-vegetarian', 'non-veg', 'meat'].includes(r.toLowerCase()))
        },
        sortPreference: result.complexAnalysis.priority === 'taste' ? 'Rating' :
                        result.complexAnalysis.priority === 'speed' ? 'DeliveryTime' : 'Relevance',
        filteredItems: result.filteredItems
      });
    } catch (error) {
      console.error('Error analyzing complex food request:', error);
      // Fall back to basic analysis
      analyzeInput(text);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle mic button click
  const handleMicClick = () => {
    if (!hasRecognitionSupport) {
      setIsModalOpen(true);
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Handle long press for modal
  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 800); // 800ms for long press
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Submit text input
  const handleSubmit = () => {
    if (inputText.trim()) {
      // Check if this is a complex request that needs advanced NLP
      const isComplex = isComplexFoodRequest(inputText);
      setIsComplexRequest(isComplex);
      
      if (isComplex && useAdvancedNLP && onAdvancedAnalysisComplete) {
        analyzeComplexInput(inputText);
      } else {
        analyzeInput(inputText);
      }
      
      setInputText('');
      setIsModalOpen(false);
    }
  };

  return (
    <section className="mb-6 md:mb-8 relative">
      {/* Hero section with voice assistant - Mobile optimized */}
      <div 
        className="text-center py-5 md:py-8 rounded-xl md:rounded-2xl mb-4 md:mb-6"
        style={applyGradientStyle('heroBackground')}
      >
        <h2 className="text-lg md:text-2xl font-semibold mb-1 md:mb-2" style={{ color: 'var(--color-text-heading)' }}>
          What's your food mood today?
        </h2>
        <p className="mb-4 md:mb-8 max-w-md mx-auto text-sm md:text-base px-4" style={{ color: 'var(--color-text-body)' }}>
          Talk to your personal food concierge to find the perfect meal
        </p>
        
        {/* Language selector - Mobile optimized */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <button
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs md:text-sm bg-white/70 hover:bg-white/90 text-gray-700 rounded-full shadow-sm transition"
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <i className="fas fa-globe text-primary"></i>
            <span className="truncate max-w-[80px] md:max-w-none">{supportedLanguages.find(lang => lang.code === currentLanguage)?.name || "English"}</span>
            <i className={`fas fa-chevron-${showLanguageSelector ? 'up' : 'down'} text-xs ml-1`}></i>
          </button>
          
          {/* Toggle for advanced NLP - More compact on mobile */}
          {onAdvancedAnalysisComplete && (
            <button 
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs md:text-sm rounded-full shadow-sm transition ${
                useAdvancedNLP ? 'bg-primary text-white' : 'bg-white/70 text-gray-700 hover:bg-white/90'
              }`}
              onClick={() => setUseAdvancedNLP(!useAdvancedNLP)}
            >
              <i className={`fas fa-${useAdvancedNLP ? 'brain' : 'lightbulb'}`}></i>
              <span className="hidden md:inline">Advanced NLP</span>
              <span className="md:hidden">AI+</span>
            </button>
          )}
          
          {/* Language dropdown - Mobile optimized */}
          {showLanguageSelector && (
            <div className="absolute mt-32 top-1/4 bg-white rounded-lg shadow-xl z-10 p-2 md:p-3 border border-gray-100 transform transition-all max-h-60 overflow-y-auto w-[180px] md:w-auto">
              <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2 px-2">Select Language</h4>
              <div className="divide-y divide-gray-100">
                {supportedLanguages.map(lang => (
                  <button
                    key={lang.code}
                    className={`w-full text-left px-2.5 py-1.5 md:px-3 md:py-2 text-xs md:text-sm hover:bg-gray-50 rounded ${currentLanguage === lang.code ? 'bg-primary/10 text-primary font-medium' : ''}`}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setShowLanguageSelector(false);
                    }}
                  >
                    {lang.name}
                    {currentLanguage === lang.code && (
                      <i className="fas fa-check ml-2 text-primary"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Voice Assistant Container - Mobile optimized */}
        <div className="relative inline-block">
          {/* Microphone Button - Enhanced for touch */}
          <button 
            className={`${isListening ? 'bg-gradient-to-r from-primary to-secondary mic-pulse' : 'bg-primary hover:bg-primary/90'} text-white rounded-full p-4 md:p-5 shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            onClick={handleMicClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <i className={`fas fa-microphone text-xl md:text-2xl ${isListening ? 'mic-icon-active' : ''}`}></i>
          </button>
          
          {/* Enhanced Voice Animation Rings */}
          {isListening && (
            <div className="mic-wave-container">
              <div className="mic-wave mic-wave-1"></div>
              <div className="mic-wave mic-wave-2"></div>
              <div className="mic-wave mic-wave-3"></div>
            </div>
          )}
          
          {isListening && (
            <p className="mt-3 md:mt-4 text-sm md:text-base font-medium text-primary">
              <span className="listening-text">Listening...</span>
            </p>
          )}
        </div>
        
        {/* Action hint - Mobile friendly */}
        {!isListening && !isAnalyzing && (
          <p className="mt-3 text-xs md:text-sm text-gray-500">
            <span>Tap to speak</span>
            <span className="mx-1">•</span>
            <span className="hidden sm:inline">Hold for text input</span>
            <span className="sm:hidden">Hold to type</span>
          </p>
        )}
        
        {/* Transcription Output - More compact on mobile */}
        {transcript && (
          <div className="mt-3 md:mt-4 max-w-xs md:max-w-md mx-auto text-dark-light px-3 py-2 rounded-lg bg-white/50 shadow-sm text-sm md:text-base">
            <p className="line-clamp-3 md:line-clamp-none">{transcript}</p>
            {isComplexRequest && useAdvancedNLP && (
              <div className="mt-1 md:mt-2 text-xs text-primary font-medium">
                <i className="fas fa-brain mr-1"></i>
                <span className="hidden sm:inline">Using advanced NLP to understand complex request</span>
                <span className="sm:hidden">Advanced AI processing</span>
              </div>
            )}
          </div>
        )}
        
        {/* Processing indicator - Mobile friendly */}
        {isAnalyzing && (
          <div className="mt-3 flex justify-center items-center">
            <div className="inline-flex items-center justify-center px-2.5 py-1 md:px-3 md:py-1.5 bg-white rounded-full shadow-sm">
              <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-xs md:text-sm">Analyzing...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Text Input Modal - Mobile optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50">
          <div 
            className="fixed inset-0 bg-dark/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Bottom sheet on mobile, centered modal on desktop */}
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl p-4 sm:p-6 w-full sm:w-11/12 sm:max-w-md z-10 
                        transition-all duration-300 ease-out transform 
                        translate-y-0 sm:translate-y-0 
                        max-h-[85vh] sm:max-h-none overflow-auto">
            
            {/* Header with close button for mobile */}
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Tell us what you're craving</h3>
              <button 
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 sm:hidden"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Modal content */}
            <input 
              type="text" 
              placeholder="Eg: 'Something spicy' or 'Veg delivery'" 
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            
            {/* Example suggestions for mobile */}
            <div className="my-3 flex flex-wrap gap-2">
              <button 
                className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => setInputText("Something for dinner")}
              >
                Something for dinner
              </button>
              <button 
                className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => setInputText("Veg meal under 30 mins")}
              >
                Veg meal under 30 mins
              </button>
              <button 
                className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => setInputText("I'm feeling adventurous")}
              >
                I'm feeling adventurous
              </button>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end mt-3 sm:mt-4 gap-2 sm:gap-3">
              <button 
                className="px-3 py-2 sm:px-4 sm:py-2 text-dark-light hover:text-dark transition text-sm sm:text-base hidden sm:block"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm sm:text-base"
                onClick={handleSubmit}
                disabled={!inputText.trim()}
              >
                <i className="fas fa-search mr-1.5"></i>
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VoiceInput;
