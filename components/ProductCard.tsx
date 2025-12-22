import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../services/productService';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  // --- FIX START: Safe Number Conversion ---
  // MySQL often returns DECIMALS as strings (e.g., "105.00").
  // We explicitly convert them to Numbers here to prevent .toFixed() crashes.
  const numericPrice = Number(product.price) || 0;
  const numericOriginalPrice = Number(product.original_price) || 0;

  // Calculate discount using the safe numeric values
  const hasDiscount = numericOriginalPrice > numericPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((numericOriginalPrice - numericPrice) / numericOriginalPrice) * 100) 
    : 0;
  // --- FIX END ---

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const numRating = Number(rating) || 0; // Ensure rating is also a number
    
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(numRating)) {
            stars.push(<i key={i} className="fas fa-star text-yellow-500"></i>);
        } else if (i === Math.ceil(numRating) && !Number.isInteger(numRating)) {
            stars.push(<i key={i} className="fas fa-star-half-alt text-yellow-500"></i>);
        } else {
            stars.push(<i key={i} className="far fa-star text-gray-400"></i>);
        }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded z-10">
            -{discountPercent}%
          </div>
        )}
        <img 
          src={getProductImage(product)} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 font-orbitron line-clamp-1">{product.title}</h3>
        
        <div className="flex items-center space-x-2 mb-3">
             <div className="text-sm">{renderStars(product.rating)}</div>
             <span className="text-xs text-gray-500">({product.rating})</span>
        </div>

        <div className="mt-auto">
            <div className="flex items-baseline space-x-2 mb-3">
                {/* USE THE SAFE NUMERIC VARIABLES HERE */}
                <span className="text-xl font-bold text-primary">BDT: {numericPrice.toFixed(2)}</span>
                
                {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">BDT: {numericOriginalPrice.toFixed(2)}</span>
                )}
            </div>
            
            <button 
                onClick={handleAddToCart}
                className={`w-full py-2 px-4 rounded font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isAdded 
                    ? 'bg-green-600 text-white' 
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
            >
                {isAdded ? (
                    <>
                        <i className="fas fa-check"></i> <span>Added</span>
                    </>
                ) : (
                    <>
                        <i className="fas fa-shopping-cart"></i> <span>Add to Cart</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;