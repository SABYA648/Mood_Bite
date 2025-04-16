import { FC, useState, useEffect } from 'react';
import MascotAvatar from './MascotAvatar';
import { useColorContext } from '@/contexts/ColorContext';
import type { FoodItem } from '@/data/mockData';

interface MascotRecommendationProps {
  mood: string;
  foodItems: FoodItem[];
  onItemSelect?: (item: FoodItem) => void;
  isVisible?: boolean;
  className?: string;
}

const MascotRecommendation: FC<MascotRecommendationProps> = ({
  mood,
  foodItems,
  onItemSelect,
  isVisible = true,
  className = ''
}) => {
  const { palette, applyGradientStyle } = useColorContext();
  const [isTalking, setIsTalking] = useState<boolean>(false);
  const [recommendedItems, setRecommendedItems] = useState<FoodItem[]>([]);
  const [mascotMessages, setMascotMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messageIndex, setMessageIndex] = useState<number>(0);
  
  // Generate personalized messages based on mood and food items
  useEffect(() => {
    if (!mood || !foodItems.length) return;
    
    const messages: string[] = [];
    
    // Intro message based on mood
    const introMessages: Record<string, string[]> = {
      happy: [
        "You seem happy! Let me brighten your day with these suggestions!",
        "Your positive energy deserves some delicious treats!"
      ],
      sad: [
        "Feeling blue? These comfort foods might help!",
        "Let me cheer you up with some delicious options!"
      ],
      hungry: [
        "I can tell you're hungry! Check these out!",
        "Let's satisfy that hunger with something delicious!"
      ],
      tired: [
        "Need a pick-me-up? These energizing options might help!",
        "These meals could give you the energy boost you need!"
      ],
      stressed: [
        "Stressful day? These comfort foods might help you relax!",
        "Take a breath and enjoy one of these soothing options!"
      ]
    };
    
    // Get intro messages for this mood or use default
    const moodIntros = introMessages[mood.toLowerCase()] || [
      `Based on your ${mood} mood, you might enjoy these:`,
      `I've picked some recommendations for your ${mood} mood!`
    ];
    
    // Add intro message
    messages.push(moodIntros[Math.floor(Math.random() * moodIntros.length)]);
    
    // Select top recommendations (up to 3)
    const topRecommendations = foodItems.slice(0, 3);
    setRecommendedItems(topRecommendations);
    
    // Add food specific messages
    if (topRecommendations.length) {
      const firstItem = topRecommendations[0];
      messages.push(`"${firstItem.dishName}" from ${firstItem.restaurant} looks perfect for you!`);
      
      if (topRecommendations.length > 1) {
        messages.push(`Or maybe try something like "${topRecommendations[1].dishName}"?`);
      }
      
      // Add closing message
      messages.push("Tap on any suggestion to add it to your cart!");
    }
    
    setMascotMessages(messages);
    setMessageIndex(0);
    setCurrentMessage(messages[0]);
    
    // Start mascot talking animation
    setIsTalking(true);
    
    // Schedule message changes
    const messageTimer = setInterval(() => {
      setMessageIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < messages.length) {
          setCurrentMessage(messages[nextIndex]);
          setIsTalking(true);
          return nextIndex;
        } else {
          clearInterval(messageTimer);
          return prevIndex;
        }
      });
    }, 6000); // Change message every 6 seconds
    
    return () => clearInterval(messageTimer);
  }, [mood, foodItems]);
  
  if (!isVisible) return null;
  
  return (
    <div className={`relative ${className}`}>
      <div 
        className="rounded-lg p-4 mb-5 relative overflow-hidden"
        style={applyGradientStyle('cardBackground')}
      >
        <div className="flex items-start">
          {/* Mascot with speech bubble */}
          <MascotAvatar 
            mood={mood} 
            isAnimating={isTalking}
            size="lg"
            withSpeechBubble={true}
            speechText={currentMessage}
            className="z-10"
          />
          
          {/* Spacer to accommodate speech bubble */}
          <div className="w-full max-w-[220px]"></div>
        </div>
        
        {/* Recommended items */}
        {recommendedItems.length > 0 && (
          <div className="mt-4 space-y-2 relative">
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-heading)' }}>
              Mascot's top picks for you:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {recommendedItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-white/90 rounded-lg p-2 cursor-pointer transform transition-transform hover:scale-105 shadow-sm"
                  onClick={() => onItemSelect && onItemSelect(item)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden mr-2">
                      {item.image && (
                        <img src={item.image} alt={item.dishName} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.dishName}</p>
                      <p className="text-xs text-gray-500 truncate">{item.restaurant}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MascotRecommendation;