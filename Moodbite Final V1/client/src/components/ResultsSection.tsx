import { FC, useState } from 'react';
import type { FoodItem } from '@shared/schema';
import NutritionalTracker from './NutritionalTracker';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, Check } from 'lucide-react';

interface ResultsSectionProps {
  filteredItems: FoodItem[];
  onClearFilters: () => void;
}

const ResultsSection: FC<ResultsSectionProps> = ({ filteredItems, onClearFilters }) => {
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const { addToCart, isInCart } = useCart();
  
  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 20, filteredItems.length, 100));
  };
  
  const visibleItems = filteredItems.slice(0, visibleCount);
  
  return (
    <section>
      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium">
          <span className="text-primary font-semibold">{filteredItems.length}</span> dishes found
        </h3>
        <button 
          className="text-secondary text-sm font-medium hover:underline"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      </div>
      
      {/* Results Grid - Responsive design with mobile-first approach */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {visibleItems.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
          >
            {/* Mobile-optimized layout (horizontal card for small screens) */}
            <div className="md:hidden flex flex-row">
              {/* Left side - food image */}
              <div className="relative w-1/3 flex-shrink-0">
                <div className="w-full h-full min-h-[110px] bg-slate-100 overflow-hidden relative">
                  {/* Loading placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <div className="animate-pulse flex">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                  
                  {/* Actual image with enhanced error handling */}
                  <img 
                    src={item.image} 
                    alt={item.dishName} 
                    className="w-full h-full object-cover absolute inset-0"
                    loading="lazy"
                    onLoad={(e) => {
                      try {
                        // Remove loading placeholder when image loads
                        const target = e.target as HTMLImageElement;
                        
                        // Reset retry count if image loaded successfully
                        target.removeAttribute('data-retry-count');
                        
                        // Fade in the image
                        target.style.opacity = '1';
                        target.style.transition = 'opacity 0.3s ease-in-out';
                        
                        // Hide the loading spinner
                        const parent = target.parentElement;
                        if (parent) {
                          const loadingDiv = parent.querySelector('div:first-child') as HTMLElement;
                          if (loadingDiv) loadingDiv.style.display = 'none';
                        }
                      } catch (err) {
                        console.error('Error in image onLoad handler:', err);
                      }
                    }}
                    onError={(e) => {
                      // Fallback if image fails to load - use a more specific API endpoint
                      const target = e.target as HTMLImageElement;
                      const encodedDishName = encodeURIComponent(item.dishName);
                      const encodedCategory = encodeURIComponent(item.category);
                      
                      // Add multiple randomization factors
                      const timestamp = Date.now();
                      const randomSeed = Math.floor(Math.random() * 1000);
                      const itemId = item.id || 0;
                      
                      // Build a fallback URL with all randomization factors
                      const fallbackUrl = `/api/food-image?query=${encodedDishName},${encodedCategory},food&t=${timestamp}-${randomSeed}-${itemId}`;
                      
                      // Track fallback attempts to prevent infinite loops
                      if (!target.getAttribute('data-retry-count')) {
                        target.setAttribute('data-retry-count', '0');
                      }
                      
                      const retryCount = parseInt(target.getAttribute('data-retry-count') || '0');
                      
                      // Limit to max 2 retries
                      if (retryCount < 2) {
                        console.log(`Image load failed for ${item.dishName}, using fallback API (attempt ${retryCount + 1})`);
                        
                        // Increment retry counter
                        target.setAttribute('data-retry-count', (retryCount + 1).toString());
                        
                        // Try the direct API endpoint
                        fetch(fallbackUrl)
                          .then(response => response.json())
                          .then(data => {
                            if (data.images && data.images.length > 0) {
                              // Add random delay to prevent browser caching issues
                              setTimeout(() => {
                                target.src = data.images[0];
                              }, 50 * Math.random());
                            }
                          })
                          .catch((err) => {
                            console.error('Error fetching fallback image:', err);
                            
                            // Use predefined fallback image URLs for reliability
                            const fallbackImages = [
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
                              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
                            ];
                            
                            // Use item ID to deterministically select a fallback
                            const fallbackIndex = (itemId + timestamp % 100) % fallbackImages.length;
                            target.src = `${fallbackImages[fallbackIndex]}?t=${timestamp}-fallback-${itemId}`;
                          });
                      } else {
                        console.log(`Max retries reached for ${item.dishName}, using predefined fallback`);
                        
                        // If all retries failed, use a reliable fallback image
                        const fallbackUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" + 
                                            `?t=${timestamp}-maxretry-${itemId}`;
                        target.src = fallbackUrl;
                      }
                    }}
                    style={{ opacity: 0 }} // Start hidden until loaded
                  />
                </div>
              </div>
              
              {/* Right side - content */}
              <div className="w-2/3 p-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-base mb-1 pr-2 line-clamp-1">{item.dishName}</h4>
                  <div className="flex items-center bg-green-50 text-success px-1 py-0.5 rounded text-xs font-medium">
                    <i className="fas fa-star text-xs mr-0.5"></i>{item.rating}
                  </div>
                </div>
                <p className="text-dark-light text-xs mb-1 line-clamp-1">{item.restaurant}</p>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1 text-xs text-dark-light">
                    <i className="fas fa-clock text-primary text-xs"></i> 
                    <span className={parseInt(item.eta) <= 20 ? 'text-accent' : ''}>
                      {item.eta} min
                    </span>
                  </div>
                  <div className="font-semibold text-sm">{item.price}</div>
                </div>
                
                {/* Compact Add to Cart Button */}
                <button
                  onClick={() => addToCart(item)}
                  className={`w-full mt-2 py-1.5 px-2 rounded text-xs flex items-center justify-center transition ${
                    isInCart(item.id) 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-primary text-white'
                  }`}
                >
                  {isInCart(item.id) ? (
                    <>
                      <Check size={12} className="mr-1" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={12} className="mr-1" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Desktop-optimized layout (vertical card for medium+ screens) */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-full h-[200px] bg-slate-100 overflow-hidden relative">
                  {/* Loading placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <div className="animate-pulse flex">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                  
                  {/* Actual image with enhanced error handling */}
                  <img 
                    src={item.image} 
                    alt={item.dishName} 
                    className="w-full h-full object-cover transition-transform hover:scale-110 absolute inset-0"
                    loading="lazy"
                    onLoad={(e) => {
                      try {
                        // Remove loading placeholder when image loads
                        const target = e.target as HTMLImageElement;
                        
                        // Reset retry count if image loaded successfully
                        target.removeAttribute('data-retry-count');
                        
                        // Fade in the image
                        target.style.opacity = '1';
                        target.style.transition = 'opacity 0.3s ease-in-out';
                        
                        // Hide the loading spinner
                        const parent = target.parentElement;
                        if (parent) {
                          const loadingDiv = parent.querySelector('div:first-child') as HTMLElement;
                          if (loadingDiv) loadingDiv.style.display = 'none';
                        }
                      } catch (err) {
                        console.error('Error in image onLoad handler:', err);
                      }
                    }}
                    onError={(e) => {
                      // Same error handling as above
                      const target = e.target as HTMLImageElement;
                      const encodedDishName = encodeURIComponent(item.dishName);
                      const encodedCategory = encodeURIComponent(item.category);
                      
                      // Add multiple randomization factors
                      const timestamp = Date.now();
                      const randomSeed = Math.floor(Math.random() * 1000);
                      const itemId = item.id || 0;
                      
                      // Build a fallback URL with all randomization factors
                      const fallbackUrl = `/api/food-image?query=${encodedDishName},${encodedCategory},food&t=${timestamp}-${randomSeed}-${itemId}`;
                      
                      // Track fallback attempts to prevent infinite loops
                      if (!target.getAttribute('data-retry-count')) {
                        target.setAttribute('data-retry-count', '0');
                      }
                      
                      const retryCount = parseInt(target.getAttribute('data-retry-count') || '0');
                      
                      // Limit to max 2 retries
                      if (retryCount < 2) {
                        console.log(`Image load failed for ${item.dishName}, using fallback API (attempt ${retryCount + 1})`);
                        
                        // Increment retry counter
                        target.setAttribute('data-retry-count', (retryCount + 1).toString());
                        
                        // Try the direct API endpoint
                        fetch(fallbackUrl)
                          .then(response => response.json())
                          .then(data => {
                            if (data.images && data.images.length > 0) {
                              // Add random delay to prevent browser caching issues
                              setTimeout(() => {
                                target.src = data.images[0];
                              }, 50 * Math.random());
                            }
                          })
                          .catch((err) => {
                            console.error('Error fetching fallback image:', err);
                            
                            // Use predefined fallback image URLs for reliability
                            const fallbackImages = [
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
                              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
                            ];
                            
                            // Use item ID to deterministically select a fallback
                            const fallbackIndex = (itemId + timestamp % 100) % fallbackImages.length;
                            target.src = `${fallbackImages[fallbackIndex]}?t=${timestamp}-fallback-${itemId}`;
                          });
                      } else {
                        console.log(`Max retries reached for ${item.dishName}, using predefined fallback`);
                        
                        // If all retries failed, use a reliable fallback image
                        const fallbackUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" + 
                                            `?t=${timestamp}-maxretry-${itemId}`;
                        target.src = fallbackUrl;
                      }
                    }}
                    style={{ opacity: 0 }} // Start hidden until loaded
                  />
                  
                  {/* Attribution badge with automatic source detection */}
                  <a 
                    href={item.image?.includes('foodish-api.herokuapp.com') ? 'https://foodish-api.herokuapp.com' : 'https://unsplash.com'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-50 hover:opacity-100 transition"
                  >
                    {item.image?.includes('foodish-api.herokuapp.com') ? 'Foodish' : 'Unsplash'}
                  </a>
                </div>
                <div className={`absolute top-3 right-3 bg-white/90 ${parseInt(item.eta) <= 20 ? 'text-accent' : 'text-primary'} px-2 py-1 rounded-full text-sm font-medium shadow-sm`}>
                  {item.eta} min
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-1">{item.dishName}</h4>
                <p className="text-dark-light text-sm mb-2">{item.restaurant}</p>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-sm bg-green-50 text-success font-medium px-2 py-0.5 rounded">
                      <i className="fas fa-star text-xs mr-1"></i>{item.rating}
                    </span>
                  </div>
                  <p className="font-semibold">{item.price}</p>
                </div>
                
                {/* Nutritional Information Collapsible Section */}
                <details className="mt-3 mb-3">
                  <summary className="cursor-pointer text-sm font-medium text-primary">
                    View Nutritional Impact
                  </summary>
                  <div className="pt-2">
                    <NutritionalTracker foodItem={item} />
                  </div>
                </details>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(item)}
                  className={`w-full mt-2 py-2 rounded-md flex items-center justify-center transition ${
                    isInCart(item.id) 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {isInCart(item.id) ? (
                    <>
                      <Check size={16} className="mr-1" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} className="mr-1" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button - Responsive for mobile */}
      {visibleCount < filteredItems.length && (
        <div className="text-center mb-12">
          <button 
            className="px-4 py-2 md:px-6 md:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-md transform hover:scale-105 text-sm md:text-base font-medium"
            onClick={handleShowMore}
          >
            Show More Dishes ({Math.min(20, filteredItems.length - visibleCount)}+)
          </button>
        </div>
      )}
    </section>
  );
};

export default ResultsSection;
