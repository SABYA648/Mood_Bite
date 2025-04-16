import { FC, useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Utensils, Clock, Star, RefreshCw } from 'lucide-react';

interface FilterSectionProps {
  mood: string;
  moodText: string;
  filters: {
    veg: boolean;
    egg: boolean;
    nonVeg: boolean;
  };
  sortPreference: string;
  maxDeliveryTime: number;
  refreshImages?: boolean;
  onFilterChange: (filterType: 'veg' | 'egg' | 'nonVeg') => void;
  onSortChange: (sort: string) => void;
  onDeliveryTimeChange: (maxTime: number) => void;
  onClearFilters: () => void;
  onRefreshImages?: () => void;
}

const FilterSection: FC<FilterSectionProps> = ({
  mood,
  moodText,
  filters,
  sortPreference,
  maxDeliveryTime,
  refreshImages,
  onFilterChange,
  onSortChange,
  onDeliveryTimeChange,
  onClearFilters,
  onRefreshImages
}) => {
  // For mobile view, control filter visibility
  const [filterExpanded, setFilterExpanded] = useState(false);
  
  // Selected filters count for badge display
  const selectedFiltersCount = Object.values(filters).filter(Boolean).length;
  const filterCount = selectedFiltersCount + (sortPreference !== 'Relevance' ? 1 : 0);
  
  return (
    <section className="mb-6">
      {/* Mobile View - Collapsible Filter Header */}
      <div className="md:hidden bg-white rounded-t-xl shadow-sm">
        <div 
          className="p-3 flex items-center justify-between cursor-pointer"
          onClick={() => setFilterExpanded(!filterExpanded)}
        >
          <div className="flex items-center">
            <div className="mr-2 flex bg-gray-100 rounded-full p-1.5">
              <Filter size={16} className="text-primary" />
            </div>
            <span className="font-medium text-sm">Filters</span>
            {filterCount > 0 && (
              <span className="ml-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
                {filterCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-2 text-xs text-gray-500">
              <span className="hidden xs:inline mr-1">Sort:</span> 
              <span className="font-medium">{sortPreference}</span>
            </div>
            {filterExpanded ? (
              <ChevronUp size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Panel - Collapsible */}
      <div className={`md:hidden bg-white px-3 pb-3 rounded-b-xl shadow-sm ${filterExpanded ? 'block' : 'hidden'}`}>
        {/* Mood Indicator */}
        <div className="mb-2 py-2 border-b border-gray-100">
          <div className="flex items-center">
            <span className="text-lg mr-1.5">{mood}</span>
            <span className="text-xs text-dark-light truncate">{moodText}</span>
          </div>
        </div>
        
        {/* Sort Options - Radio Style */}
        <div className="mb-2 pb-2 border-b border-gray-100">
          <div className="text-xs font-medium mb-1.5 text-dark-light">Sort By:</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`text-xs py-1 px-2 rounded flex items-center justify-center ${
                sortPreference === 'Relevance' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onSortChange('Relevance')}
            >
              <Utensils size={12} className="mr-1" />
              <span>Relevance</span>
            </button>
            <button
              className={`text-xs py-1 px-2 rounded flex items-center justify-center ${
                sortPreference === 'Rating' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onSortChange('Rating')}
            >
              <Star size={12} className="mr-1" />
              <span>Rating</span>
            </button>
            <button
              className={`text-xs py-1 px-2 rounded flex items-center justify-center ${
                sortPreference === 'DeliveryTime' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onSortChange('DeliveryTime')}
            >
              <Clock size={12} className="mr-1" />
              <span>Time</span>
            </button>
          </div>
        </div>
        
        {/* Diet Preference Toggles */}
        <div className="mb-2">
          <div className="text-xs font-medium mb-1.5 text-dark-light">Dietary Preferences:</div>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1 text-xs rounded-full ${
                filters.veg 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onFilterChange('veg')}
            >
              Veg
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded-full ${
                filters.egg 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onFilterChange('egg')}
            >
              Egg
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded-full ${
                filters.nonVeg 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onFilterChange('nonVeg')}
            >
              Non-Veg
            </button>
            
            {/* Refresh Images Button - only show if handler provided */}
            {onRefreshImages && (
              <button 
                className={`flex items-center justify-center px-3 py-1 text-xs rounded-full ${
                  refreshImages 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={onRefreshImages}
                title="Refresh images using Unsplash API"
              >
                <RefreshCw size={12} className="mr-1" />
                <span>Images</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Delivery Time Slider */}
        <div className="mb-2 pb-2 border-b border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs font-medium text-dark-light">Max Delivery Time:</div>
            <div className="text-xs font-medium">{maxDeliveryTime < 60 ? `${maxDeliveryTime} min` : '60+ min'}</div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="60" 
            step="5"
            value={maxDeliveryTime} 
            onChange={(e) => onDeliveryTimeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 min</span>
            <span>30 min</span>
            <span>60+ min</span>
          </div>
        </div>
        
        {/* Clear Filters */}
        <div className="mt-3 text-center">
          <button 
            className="text-xs text-primary hover:underline"
            onClick={onClearFilters}
          >
            Clear All Filters
          </button>
        </div>
      </div>
      
      {/* Desktop View - Traditional */}
      <div className="hidden md:flex md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
        {/* Mood Indicator */}
        <div className="flex items-center">
          <span className="text-2xl mr-2">{mood}</span>
          <span className="text-sm text-dark-light">{moodText}</span>
        </div>
        
        {/* Filters Container */}
        <div className="flex flex-wrap gap-3">
          {/* Diet Preference Toggles */}
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1.5 text-sm rounded-full border ${filters.veg ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary hover:text-primary'} transition`}
              onClick={() => onFilterChange('veg')}
            >
              Veg
            </button>
            <button 
              className={`px-3 py-1.5 text-sm rounded-full border ${filters.egg ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary hover:text-primary'} transition`}
              onClick={() => onFilterChange('egg')}
            >
              Egg
            </button>
            <button 
              className={`px-3 py-1.5 text-sm rounded-full border ${filters.nonVeg ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary hover:text-primary'} transition`}
              onClick={() => onFilterChange('nonVeg')}
            >
              Non-Veg
            </button>
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select 
              className="appearance-none pl-3 pr-8 py-1.5 text-sm rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={sortPreference}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="Relevance">Relevance</option>
              <option value="Rating">Rating</option>
              <option value="DeliveryTime">Delivery Time</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-light">
              <ChevronDown size={14} />
            </div>
          </div>
          
          {/* Delivery Time Slider - Desktop */}
          <div className="flex items-center space-x-2 min-w-[180px]">
            <div className="text-xs whitespace-nowrap">Max Time: {maxDeliveryTime < 60 ? `${maxDeliveryTime} min` : '60+ min'}</div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={maxDeliveryTime}
              onChange={(e) => onDeliveryTimeChange(Number(e.target.value))}
              className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Refresh Images Button - only show if handler provided */}
          {onRefreshImages && (
            <button 
              className={`flex items-center justify-center px-3 py-1.5 text-sm rounded-full border ${
                refreshImages 
                  ? 'bg-primary text-white border-primary' 
                  : 'border-gray-300 hover:border-primary hover:text-primary'
              } transition`}
              onClick={onRefreshImages}
              title="Refresh images using Unsplash API"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
