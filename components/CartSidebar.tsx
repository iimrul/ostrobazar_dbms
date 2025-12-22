import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../services/productService';

const CartSidebar: React.FC = () => {
  const { 
    cart, 
    isOpen, 
    setIsOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    shipping, 
    total,
    applyDiscount,
    discount,
    clearCart
  } = useCart();

  const [discountCode, setDiscountCode] = useState('');
  const [discountMsg, setDiscountMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    const result = applyDiscount(discountCode);
    setDiscountMsg({
        type: result.success ? 'success' : 'error',
        text: result.message
    });
  };

  const handleCheckout = () => {
    alert("Thanks For Buying From BIn Laden Store");
    clearCart();
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold font-orbitron text-secondary">Your Cart</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <i className="fas fa-shopping-cart text-4xl text-gray-300"></i>
              <p>Your cart is empty</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 animate-[fadeIn_0.3s]">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img src={getProductImage(item)} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h4 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h4>
                        <div className="text-primary font-bold text-sm">BDT: {(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gray-300 rounded">
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >-</button>
                            <input 
                                type="text" 
                                value={item.quantity} 
                                readOnly 
                                className="w-8 text-center text-black text-sm border-x border-gray-300 py-1"
                            />
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >+</button>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors text-sm"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
            <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>BDT: {(subtotal + discount).toFixed(2)}</span>
            </div>
            {discount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                    <span>Discount:</span>
                    <span>- BDT: {discount.toFixed(2)}</span>
                </div>
            )}
            <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : `BDT: ${shipping.toFixed(2)}`}
                </span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>BDT: {total.toFixed(2)}</span>
            </div>

            {/* Discount Input */}
            <div className="pt-2">
                <div className="flex space-x-2">
                    <input 
                        type="text" 
                        placeholder="Discount Code" 
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary text-gray-900"
                    />
                    <button 
                        onClick={handleApplyDiscount}
                        className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
                    >
                        Apply
                    </button>
                </div>
                {discountMsg && (
                    <p className={`text-xs mt-1 ${discountMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {discountMsg.text}
                    </p>
                )}
            </div>

            <button 
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded shadow-lg transition-transform hover:-translate-y-1 mt-2"
                onClick={handleCheckout}
            >
                Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;