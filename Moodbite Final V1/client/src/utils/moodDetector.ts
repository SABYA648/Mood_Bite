interface MoodDetails {
  emoji: string;
  text: string;
}

// Expanded mood map for a wide variety of moods
const MOOD_MAP: Record<string, MoodDetails> = {
  // Happy moods
  happy: { emoji: '😊', text: 'Happy mood' },
  joyful: { emoji: '😄', text: 'Joyful mood' },
  excited: { emoji: '🤩', text: 'Excited mood' },
  cheerful: { emoji: '😁', text: 'Cheerful mood' },
  elated: { emoji: '🥳', text: 'Elated mood' },
  thrilled: { emoji: '😆', text: 'Thrilled mood' },
  optimistic: { emoji: '😃', text: 'Optimistic mood' },
  content: { emoji: '😌', text: 'Content mood' },
  
  // Sad moods
  sad: { emoji: '😔', text: 'Comfort food mood' },
  melancholic: { emoji: '🥺', text: 'Melancholic mood' },
  gloomy: { emoji: '😞', text: 'Gloomy mood' },
  depressed: { emoji: '😥', text: 'Need-a-pick-me-up mood' },
  down: { emoji: '😟', text: 'Down mood' },
  blue: { emoji: '💙', text: 'Blue mood' },
  heartbroken: { emoji: '💔', text: 'Heartbroken mood' },
  disappointed: { emoji: '😒', text: 'Disappointed mood' },
  
  // Angry moods
  angry: { emoji: '😠', text: 'Angry mood' },
  irritated: { emoji: '😤', text: 'Irritated mood' },
  furious: { emoji: '😡', text: 'Furious mood' },
  enraged: { emoji: '🤬', text: 'Enraged mood' },
  annoyed: { emoji: '😒', text: 'Annoyed mood' },
  frustrated: { emoji: '😩', text: 'Frustrated mood' },
  indignant: { emoji: '😤', text: 'Indignant mood' },
  bitter: { emoji: '😑', text: 'Bitter mood' },
  
  // Anxious moods
  anxious: { emoji: '😰', text: 'Anxious mood' },
  nervous: { emoji: '😬', text: 'Nervous mood' },
  worried: { emoji: '😟', text: 'Worried mood' },
  stressed: { emoji: '😫', text: 'Stressed mood' },
  overwhelmed: { emoji: '🥴', text: 'Overwhelmed mood' },
  tense: { emoji: '😖', text: 'Tense mood' },
  uneasy: { emoji: '😕', text: 'Uneasy mood' },
  apprehensive: { emoji: '😨', text: 'Apprehensive mood' },
  
  // Tired moods
  tired: { emoji: '😴', text: 'Tired mood' },
  exhausted: { emoji: '🥱', text: 'Exhausted mood' },
  lethargic: { emoji: '💤', text: 'Lethargic mood' },
  fatigued: { emoji: '😪', text: 'Fatigued mood' },
  drained: { emoji: '😩', text: 'Drained mood' },
  sleepy: { emoji: '😪', text: 'Sleepy mood' },
  weary: { emoji: '😮‍💨', text: 'Weary mood' },
  'worn-out': { emoji: '😫', text: 'Worn-out mood' },
  
  // Hungry moods
  hungry: { emoji: '😋', text: 'Hungry mood' },
  starving: { emoji: '🤤', text: 'Starving mood' },
  ravenous: { emoji: '🍽️', text: 'Ravenous mood' },
  peckish: { emoji: '🫦', text: 'Peckish mood' },
  famished: { emoji: '😵', text: 'Famished mood' },
  empty: { emoji: '🕳️', text: 'Empty-stomach mood' },
  appetite: { emoji: '🍴', text: 'Big appetite mood' },
  craving: { emoji: '🤤', text: 'Craving mood' },
  
  // Romantic moods
  romantic: { emoji: '💘', text: 'Romantic mood' },
  passionate: { emoji: '❤️‍🔥', text: 'Passionate mood' },
  affectionate: { emoji: '🥰', text: 'Affectionate mood' },
  loving: { emoji: '❤️', text: 'Loving mood' },
  tender: { emoji: '💖', text: 'Tender mood' },
  intimate: { emoji: '💑', text: 'Intimate mood' },
  amorous: { emoji: '💓', text: 'Amorous mood' },
  sentimental: { emoji: '🥲', text: 'Sentimental mood' },
  
  // Bored moods
  bored: { emoji: '🥱', text: 'Bored mood' },
  disinterested: { emoji: '😑', text: 'Disinterested mood' },
  indifferent: { emoji: '😐', text: 'Indifferent mood' },
  apathetic: { emoji: '😶', text: 'Apathetic mood' },
  unimpressed: { emoji: '😒', text: 'Unimpressed mood' },
  monotonous: { emoji: '🔄', text: 'Monotonous mood' },
  uninspired: { emoji: '🫥', text: 'Uninspired mood' },
  dull: { emoji: '😴', text: 'Dull mood' },
  
  // Adventurous moods
  adventurous: { emoji: '🗺️', text: 'Adventurous mood' },
  daring: { emoji: '🤠', text: 'Daring mood' },
  bold: { emoji: '😎', text: 'Bold mood' },
  explorative: { emoji: '🧭', text: 'Explorative mood' },
  curious: { emoji: '🧐', text: 'Curious mood' },
  brave: { emoji: '💪', text: 'Brave mood' },
  venturesome: { emoji: '🌍', text: 'Venturesome mood' },
  spontaneous: { emoji: '🎯', text: 'Spontaneous mood' },
  
  // Peaceful moods
  peaceful: { emoji: '🕊️', text: 'Peaceful mood' },
  calm: { emoji: '😌', text: 'Calm mood' },
  tranquil: { emoji: '🧘', text: 'Tranquil mood' },
  serene: { emoji: '🌅', text: 'Serene mood' },
  relaxed: { emoji: '😎', text: 'Relaxed mood' },
  composed: { emoji: '🧠', text: 'Composed mood' },
  centered: { emoji: '⚖️', text: 'Centered mood' },
  balanced: { emoji: '🙏', text: 'Balanced mood' },
  
  // Energetic moods
  energetic: { emoji: '⚡', text: 'Energetic mood' },
  lively: { emoji: '💃', text: 'Lively mood' },
  vibrant: { emoji: '✨', text: 'Vibrant mood' },
  dynamic: { emoji: '🏃', text: 'Dynamic mood' },
  spirited: { emoji: '🎉', text: 'Spirited mood' },
  animated: { emoji: '🤸', text: 'Animated mood' },
  enthusiastic: { emoji: '🔆', text: 'Enthusiastic mood' },
  zealous: { emoji: '🚀', text: 'Zealous mood' },
  
  // Special mood categories
  spicy: { emoji: '🔥', text: 'Spicy mood' },
  afraid: { emoji: '😨', text: 'Comfort food mood' },
  neutral: { emoji: '😐', text: 'What are you craving?' }
};

// Get mood emoji and text based on detected mood
export const getMoodDetails = (mood: string): MoodDetails => {
  // Convert to lowercase
  const lowerMood = mood.toLowerCase();
  
  // Check for exact match
  if (MOOD_MAP[lowerMood]) {
    return MOOD_MAP[lowerMood];
  }
  
  // Check for partial match
  for (const key of Object.keys(MOOD_MAP)) {
    if (lowerMood.includes(key) || key.includes(lowerMood)) {
      return MOOD_MAP[key];
    }
  }
  
  // Default to hungry if no mood is recognized
  return MOOD_MAP.hungry;
};
