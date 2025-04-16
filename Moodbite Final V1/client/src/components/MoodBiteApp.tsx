import { FC, useState, useEffect } from 'react';
import Header from './Header';
import VoiceInput from './VoiceInput';
import FilterSection from './FilterSection';
import ResultsSection from './ResultsSection';
import Footer from './Footer';
import MascotRecommendation from './MascotRecommendation';
import MascotAvatar from './MascotAvatar';
import { FoodItem } from '@shared/schema';
import { getMoodDetails } from '@/utils/moodDetector';
import { useFoodItems } from '@/hooks/use-food-items';
import type { MoodAnalysisResult } from '@/hooks/use-mood-analysis';
import type { AdvancedFoodRequestResult } from '@/hooks/use-advanced-food-request';
import { CartProvider, useCart } from '../contexts/CartContext';
import { ColorProvider, useColorContext } from '../contexts/ColorContext';

// Define storage keys
const STORAGE_KEYS = {
  FILTERS: 'moodbite_filters',
  SORT: 'moodbite_sort',
  MOOD: 'moodbite_mood',
  MOOD_TEXT: 'moodbite_mood_text'
};

const MoodBiteApp: FC = () => {
  // State for filters, sort, mood
  const [filters, setFilters] = useState({
    veg: false,
    egg: false,
    nonVeg: false
  });
  
  const [sortPreference, setSortPreference] = useState<string>('Relevance');
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60); // Default to 60 minutes (max)
  const [mood, setMood] = useState<string>('😋');
  const [moodText, setMoodText] = useState<string>('What are you craving?');
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  
  // Track whether user has made their first search
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  // Flag to enable the advanced NLP processing (always enabled since we're removing the checkbox)
  const [useAdvancedNLP, setUseAdvancedNLP] = useState<boolean>(true);
  
  // State for controlling image refresh 
  const [refreshImages, setRefreshImages] = useState<boolean>(false);
  
  // State for mascot's activity
  const [isMascotActive, setIsMascotActive] = useState<boolean>(false);
  const [showMascotRecommendation, setShowMascotRecommendation] = useState<boolean>(false);

  // Fetch food items from API with refresh images option
  const { data: foodItemsData, isLoading, error } = useFoodItems({ refreshImages });
  
  // Load saved preferences on mount
  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem(STORAGE_KEYS.FILTERS);
      const savedSort = localStorage.getItem(STORAGE_KEYS.SORT);
      const savedMood = localStorage.getItem(STORAGE_KEYS.MOOD);
      const savedMoodText = localStorage.getItem(STORAGE_KEYS.MOOD_TEXT);
      
      if (savedFilters) setFilters(JSON.parse(savedFilters));
      if (savedSort) setSortPreference(savedSort);
      if (savedMood) setMood(savedMood);
      if (savedMoodText) setMoodText(savedMoodText);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);
  
  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
  }, [filters]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SORT, sortPreference);
  }, [sortPreference]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOOD, mood);
    localStorage.setItem(STORAGE_KEYS.MOOD_TEXT, moodText);
  }, [mood, moodText]);
  
  // Update filtered items when data, filters, sort preference, or delivery time changes
  useEffect(() => {
    if (!foodItemsData) return;
    
    let results = [...foodItemsData];
    
    // Apply category filters
    const activeFilters = Object.entries(filters).filter(([_, isActive]) => isActive);
    
    if (activeFilters.length > 0) {
      results = results.filter(item => {
        return activeFilters.some(([filterName]) => item.category === filterName);
      });
    }
    
    // Apply delivery time filter
    if (maxDeliveryTime < 60) {
      results = results.filter(item => {
        // Parse the delivery time (remove any 'min' or other text and convert to number)
        const deliveryTime = parseInt(item.eta);
        return !isNaN(deliveryTime) && deliveryTime <= maxDeliveryTime;
      });
    }
    
    // Apply sorting
    switch (sortPreference) {
      case 'Rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'DeliveryTime':
        results.sort((a, b) => parseInt(a.eta) - parseInt(b.eta));
        break;
      // Relevance is default and uses the existing order
    }
    
    setFilteredItems(results);
  }, [foodItemsData, filters, sortPreference, maxDeliveryTime]);
  
  // Show loading state while fetching data
  if (isLoading) {
    return (
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Loading delicious food options...</p>
            </div>
          </main>
          <Footer />
        </div>
      </CartProvider>
    );
  }
  
  // Show error state if there's an issue fetching data
  if (error) {
    return (
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
              <p className="mb-4">We couldn't load the food items. Please try again later.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </CartProvider>
    );
  }
  
  // Handle voice input completion
  const handleTranscriptionComplete = (text: string, analysis: MoodAnalysisResult) => {
    // Mark that user has searched
    setHasSearched(true);
    
    // Get mood emoji and text from NLP-detected mood
    const { emoji, text: moodDescription } = getMoodDetails(analysis.mood);
    setMood(emoji);
    setMoodText(moodDescription);
    
    // Update filters based on analysis
    setFilters({
      veg: analysis.dietary.isVeg,
      egg: analysis.dietary.isEgg,
      nonVeg: analysis.dietary.isNonVeg
    });
    
    // Update sort preference
    setSortPreference(analysis.sortPreference);
    
    // Auto-set delivery time based on user input
    // Look for time-related keywords in the input text
    if (text.toLowerCase().includes('fast') || text.toLowerCase().includes('quick') || text.toLowerCase().includes('hurry')) {
      // Set a shorter delivery time for urgent requests
      setMaxDeliveryTime(20);
    } else if (text.toLowerCase().includes('soon') || text.toLowerCase().includes('hungry now')) {
      setMaxDeliveryTime(30);
    } else {
      // Default to max time if no time constraints mentioned
      setMaxDeliveryTime(60);
    }
    
    // If we received filtered items, update those too
    if (analysis.filteredItems && analysis.filteredItems.length > 0) {
      setFilteredItems(analysis.filteredItems);
    }
  };
  
  // Toggle individual filter
  const handleFilterChange = (filterType: 'veg' | 'egg' | 'nonVeg') => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };
  
  // Update sort preference
  const handleSortChange = (sort: string) => {
    setSortPreference(sort);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({ veg: false, egg: false, nonVeg: false });
    setSortPreference('Relevance');
    setMaxDeliveryTime(60); // Reset delivery time to max
  };
  
  // Toggle image refresh (uses Unsplash API)
  const handleRefreshImages = () => {
    setRefreshImages(prev => !prev);
  };
  
  // Handle delivery time changes
  const handleDeliveryTimeChange = (time: number) => {
    setMaxDeliveryTime(time);
  };

  // Handle advanced NLP analysis completion
  const handleAdvancedAnalysis = (text: string, result: AdvancedFoodRequestResult) => {
    // Mark that user has searched
    setHasSearched(true);
    
    // Update the filtered items directly with the advanced analysis results
    if (result.filteredItems && result.filteredItems.length > 0) {
      setFilteredItems(result.filteredItems);
    }

    // Update the mood emoji and text based on the mood from advanced analysis
    const { emoji, text: moodDescription } = getMoodDetails(result.mood);
    setMood(emoji);
    setMoodText(moodDescription);

    // Update filters based on dietary restrictions in the complex analysis
    const hasVeg = result.complexAnalysis.dietaryRestrictions.some(r => 
      r.toLowerCase() === 'vegetarian' || r.toLowerCase() === 'vegan');
    
    const hasEgg = result.complexAnalysis.dietaryRestrictions.some(r => 
      r.toLowerCase() === 'egg');
    
    const hasNonVeg = result.complexAnalysis.dietaryRestrictions.some(r => 
      ['non-vegetarian', 'non-veg', 'meat', 'chicken', 'beef', 'pork', 'fish', 'seafood'].includes(r.toLowerCase()));
    
    setFilters({
      veg: hasVeg,
      egg: hasEgg,
      nonVeg: hasNonVeg
    });

    // Update sort preference based on the advanced analysis priority
    switch (result.complexAnalysis.priority) {
      case 'taste':
        setSortPreference('Rating');
        break;
      case 'speed':
        // When speed is the priority, also set a shorter delivery time
        setSortPreference('DeliveryTime');
        setMaxDeliveryTime(25); // Shorter delivery time
        break;
      default:
        setSortPreference('Relevance');
    }
    
    // Also set delivery time based on the urgency in the input text
    if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('immediately')) {
      setMaxDeliveryTime(15); // Very short delivery time for urgent requests
    } else if (text.toLowerCase().includes('fast') || text.toLowerCase().includes('quick')) {
      setMaxDeliveryTime(25); // Short delivery time
    } else if (result.complexAnalysis.priority === 'speed') {
      setMaxDeliveryTime(30); // Medium delivery time for speed priority
    } else {
      // Default to max time if no time constraints mentioned and not a speed priority
      setMaxDeliveryTime(60);
    }

    // Log the complex analysis
    console.log('Advanced NLP analysis:', result.complexAnalysis);
  };
  
  return (
    <ColorProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-6">
            <VoiceInput 
              onTranscriptionComplete={handleTranscriptionComplete}
              onAdvancedAnalysisComplete={handleAdvancedAnalysis}
              useAdvancedNLP={useAdvancedNLP}
            />
            
            {/* Advanced NLP toggle removed as requested */}
            
            <FilterSection 
              mood={mood}
              moodText={moodText}
              filters={filters}
              sortPreference={sortPreference}
              maxDeliveryTime={maxDeliveryTime}
              refreshImages={refreshImages}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              onDeliveryTimeChange={handleDeliveryTimeChange}
              onClearFilters={handleClearFilters}
              onRefreshImages={handleRefreshImages}
            />
            
            {hasSearched ? (
              <ResultsSection 
                filteredItems={filteredItems}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <div className="mt-8 text-center">
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-2xl font-bold mb-2">Tell us what you're craving</h2>
                <p className="text-gray-600 mb-4">Use the voice input above to get personalized food recommendations</p>
                <div className="text-sm text-gray-500 italic">Tap the microphone to speak, or long-press for text input</div>
              </div>
            )}
          </main>
          
          <Footer />
        </div>
      </CartProvider>
    </ColorProvider>
  );
};

export default MoodBiteApp;
