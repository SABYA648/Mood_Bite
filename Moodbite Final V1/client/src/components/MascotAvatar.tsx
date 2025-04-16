import { FC, useState, useEffect } from 'react';
import { useColorContext } from '@/contexts/ColorContext';

interface MascotAvatarProps {
  mood: string;
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withSpeechBubble?: boolean;
  speechText?: string;
}

const MascotAvatar: FC<MascotAvatarProps> = ({
  mood,
  isAnimating = false,
  size = 'md',
  className = '',
  withSpeechBubble = false,
  speechText
}) => {
  const { palette } = useColorContext();
  const [currentAnimation, setCurrentAnimation] = useState<string>('idle');
  const [recommendationText, setRecommendationText] = useState<string>('');
  
  // Map mood to mascot expressions
  const getMascotExpression = (mood: string): string => {
    const moodMap: Record<string, string> = {
      happy: '😊',
      excited: '🤩',
      energetic: '😃',
      joyful: '😄',
      ecstatic: '😁',
      cheerful: '😀',
      
      sad: '😔',
      melancholy: '🥺',
      gloomy: '😞',
      
      stressed: '😩',
      anxious: '😟',
      worried: '😨',
      
      calm: '😌',
      relaxed: '😎',
      peaceful: '☺️',
      
      hungry: '🤤',
      starving: '😋',
      
      tired: '😴',
      sleepy: '😪',
      
      bored: '😒',
      
      romantic: '😍',
      loved: '🥰',
      
      sick: '🤒',
      
      surprised: '😲',
      shocked: '😱',
      
      angry: '😠',
      frustrated: '😤',
      annoyed: '😒',
      
      confused: '🤔',
      curious: '🧐',
      
      thoughtful: '🤨',
      reflective: '🙂',
      
      adventurous: '🤠',
      brave: '💪',
      
      grateful: '🙏',
      thankful: '👍',
      
      proud: '😌',
      accomplished: '🏆',
      
      creative: '🎨',
      inspired: '💡',
      
      // Default to a neutral face
      neutral: '🙂'
    };
    
    return moodMap[mood.toLowerCase()] || moodMap.neutral;
  };
  
  // Get personalized recommendations based on mood
  const getMoodRecommendation = (mood: string): string => {
    const recommendations: Record<string, string[]> = {
      happy: [
        "How about something fun and colorful?",
        "Let's celebrate with something special!",
        "Time for a happy meal that matches your mood!"
      ],
      sad: [
        "Some comfort food might help you feel better",
        "How about something warm and soothing?",
        "Let me find something to brighten your day"
      ],
      stressed: [
        "I suggest something simple and nutritious",
        "Let's find something that won't add to your stress",
        "A calming tea with your meal perhaps?"
      ],
      tired: [
        "You need something energizing!",
        "How about a meal that's quick to prepare?",
        "Let me find something that will perk you up"
      ],
      hungry: [
        "Let's find something filling and satisfying!",
        "Time for a hearty meal that'll hit the spot",
        "I know exactly what will satisfy that hunger"
      ],
      adventurous: [
        "Let's try something exotic and new!",
        "How about a culinary adventure today?",
        "I've got some exciting suggestions for you"
      ]
    };
    
    // Get recommendations for the mood, or use neutral recommendations
    const moodRecommendations = recommendations[mood.toLowerCase()] || [
      "I've got some great meal ideas for you!",
      "Let me help you find the perfect meal",
      "What are you in the mood for today?"
    ];
    
    // Pick a random recommendation
    return moodRecommendations[Math.floor(Math.random() * moodRecommendations.length)];
  };
  
  // Update animation based on props
  useEffect(() => {
    if (isAnimating) {
      setCurrentAnimation('talking');
      
      // If no speech text is provided, generate one based on mood
      if (!speechText) {
        setRecommendationText(getMoodRecommendation(mood));
      }
      
      // Reset to idle after animation
      const timer = setTimeout(() => {
        setCurrentAnimation('idle');
      }, 6000);
      
      return () => clearTimeout(timer);
    } else {
      setCurrentAnimation('idle');
    }
  }, [isAnimating, mood, speechText]);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl'
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Mascot avatar */}
      <div 
        className={`rounded-full flex items-center justify-center ${sizeClasses[size]} 
                   relative overflow-hidden mascot-container
                   ${currentAnimation === 'talking' ? 'mascot-talking' : ''}`}
        style={{ 
          background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(255, 255, 255, 0.4)` 
        }}
      >
        <span className="mascot-face">
          {getMascotExpression(mood)}
        </span>
      </div>
      
      {/* Speech bubble */}
      {withSpeechBubble && (currentAnimation === 'talking' || speechText) && (
        <div className="absolute top-0 left-full ml-2 bg-white px-3 py-2 rounded-lg rounded-bl-none shadow-md 
                        speech-bubble-animation z-10 min-w-[140px] max-w-[200px] text-sm">
          <div className="absolute -left-2 bottom-1/2 w-3 h-3 bg-white transform rotate-45"></div>
          <p className="text-gray-800">
            {speechText || recommendationText}
          </p>
        </div>
      )}
    </div>
  );
};

export default MascotAvatar;