import { FC, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { X, Minus, Plus, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSlider: FC<CartSliderProps> = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    getItemCount,
    clearCart
  } = useCart();

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!');
    clearCart();
    onClose();
  };

  const cartItemCount = getItemCount();
  const cartTotal = getCartTotal();
  const deliveryFee = 40;
  const totalAmount = cartTotal + deliveryFee;

  return (
    <div 
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col max-h-full`}
    >
      {/* Mobile-friendly Header */}
      <div className="flex justify-between items-center p-3 sm:p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 sm:hidden"
          aria-label="Close cart"
        >
          <ArrowLeft size={18} />
        </button>
        
        <h2 className="text-base sm:text-xl font-semibold flex items-center mx-auto sm:mx-0">
          <ShoppingBag className="mr-1.5 sm:mr-2" size={18} />
          Your Cart
          {cartItemCount > 0 && (
            <span className="ml-1.5 sm:ml-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
              {cartItemCount}
            </span>
          )}
        </h2>
        
        <div className="flex items-center">
          {cartItemCount > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all items from cart?')) {
                  clearCart();
                }
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 hidden sm:block"
              aria-label="Clear cart"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 hidden sm:block"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Cart items - scrollable area */}
      <div className="flex-grow overflow-y-auto overscroll-contain p-3 sm:p-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
            <ShoppingBag size={64} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="mt-1 text-sm">Add some delicious items to get started!</p>
            <button
              onClick={onClose}
              className="mt-6 px-4 py-2 bg-primary text-white rounded-full text-sm"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <ul className="divide-y">
            {cartItems.map(item => (
              <li key={item.id} className="py-3 sm:py-4">
                <div className="flex items-start">
                  {/* Image - smaller on mobile */}
                  <div className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.dishName}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="ml-3 sm:ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm sm:text-base font-medium line-clamp-1">{item.dishName}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 ml-1 p-0.5"
                        aria-label="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <p className="mt-0.5 text-xs sm:text-sm text-gray-500 line-clamp-1">{item.restaurant}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Controls - more compact on mobile */}
                      <div className="flex items-center border rounded-md bg-gray-50">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 hover:bg-gray-100 text-gray-500"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 sm:px-3 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 hover:bg-gray-100 text-gray-500"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      {/* Price */}
                      <p className="font-medium text-sm sm:text-base">{item.price}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer with total and checkout - fixed at bottom */}
      {cartItems.length > 0 && (
        <div className="border-t p-3 sm:p-4 bg-white">
          {/* Coupon code input on large screens */}
          <div className="hidden sm:flex mb-3 items-center">
            <input 
              type="text"
              placeholder="Promo code"
              className="flex-1 py-1.5 px-3 border border-gray-200 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="bg-gray-100 text-gray-700 py-1.5 px-3 rounded-r-md text-sm border border-gray-200 border-l-0 hover:bg-gray-200 transition">
              Apply
            </button>
          </div>
          
          {/* Order summary */}
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t text-base font-bold">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            className="w-full py-2.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 
                       text-sm sm:text-base font-medium shadow-sm transition flex items-center justify-center"
          >
            Proceed to Checkout
          </button>
          
          {/* Message about taxes */}
          <p className="text-xs text-gray-500 text-center mt-2">
            Taxes and service charges included
          </p>
        </div>
      )}
    </div>
  );
};

export default CartSlider;