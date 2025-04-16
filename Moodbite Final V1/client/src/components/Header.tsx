import { FC, useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Home } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartSlider from './CartSlider';

const Header: FC = () => {
  const { getItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const itemCount = getItemCount();

  // Handle scroll effect for the sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Header - Sticky with shadow on scroll */}
      <header className={`sticky top-0 z-30 w-full bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}>
        {/* Mobile Header */}
        <div className="md:hidden container mx-auto px-3 py-2.5 flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <h1 className="text-xl font-accent font-bold text-primary">
              <span className="text-green-600">Mood</span>Bite
            </h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            {/* Cart Button - More prominent on mobile */}
            <button 
              className="relative p-2 text-primary hover:bg-gray-100 rounded-full transition"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            
            {/* Menu Toggle Button (Hamburger/Close) */}
            <button 
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Collapsible */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-64 border-t border-gray-100' : 'max-h-0'
        }`}>
          <div className="px-4 py-2 flex flex-col space-y-2">
            <a 
              href="/" 
              className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700 transition"
            >
              <Home size={18} className="mr-2 text-primary" />
              <span>Home</span>
            </a>
            <a 
              href="https://sabyasachimishra.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700 transition"
            >
              <User size={18} className="mr-2 text-primary" />
              <span>About</span>
            </a>
          </div>
        </div>
        
        {/* Desktop Header */}
        <div className="hidden md:flex container mx-auto px-4 py-3 justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-accent font-bold text-primary">
              <span className="text-green-600">Mood</span>Bite
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://sabyasachimishra.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-light hover:text-dark text-sm font-medium transition"
            >
              About
            </a>
            <button 
              className="relative p-2 text-primary hover:bg-gray-100 rounded-full transition"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingBag size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Cart Slider */}
      <CartSlider 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      
      {/* Overlay when cart is open or mobile menu is open */}
      {(isCartOpen || (isMenuOpen && window.innerWidth < 768)) && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isCartOpen ? 'bg-opacity-50 z-40' : 'bg-opacity-30 z-20'
          }`}
          onClick={() => {
            if (isCartOpen) setIsCartOpen(false);
            if (isMenuOpen) setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
