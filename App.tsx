import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import CategorySection from './components/CategorySection';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { fetchProducts } from './services/productService';
import { Product } from './types';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(false);
      } catch (err) {
        console.error("Error fetching products", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Guns', 'Missiles', 'Rockets', 'Drones/UAVs'];

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar onSearch={setSearchQuery} />
        
        <main className="flex-grow bg-secondary">
          <HeroSlider />
          
          <CategorySection onSelectCategory={setSelectedCategory} />

          {/* Products Section */}
          <section id="products" className="py-16 container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white relative inline-block pb-2">
                Featured Products
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary"></span>
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'All' ? 'all' : cat)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors border ${
                    (selectedCategory === cat || (selectedCategory === 'all' && cat === 'All'))
                      ? 'bg-primary border-primary text-white'
                      : 'bg-transparent border-gray-600 text-gray-300 hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Results info */}
            {searchQuery && (
              <div className="text-center mb-6 text-gray-400">
                <p>Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"</p>
              </div>
            )}

            {/* Products Grid */}
            <div className="min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-white">
                  <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                  <p>Loading products...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-900/50 rounded-lg border border-red-900 mx-auto max-w-2xl">
                  <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                  <h3 className="text-xl font-bold text-white mb-2">System Offline</h3>
                  <p className="text-gray-300 mb-4">Could not connect to the Weapons Database.</p>
                  <div className="text-left bg-black p-4 rounded text-sm font-mono text-green-500">
                    <p>$ Error: Connection Refused (port 3000)</p>
                    <p>$ Hint: Ensure Backend is running.</p>
                    <p>$ Command: <span className="text-white">npm start</span> (in terminal)</p>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p>No products found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Special Offer */}
          <section className="bg-primary-dark text-white text-center py-16 my-8" id="deals">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-orbitron font-bold mb-4">Special Offer</h2>
              <p className="text-xl mb-6">Get 20% off on selected items with code <strong className="bg-white/20 px-2 py-1 rounded">IMRU2</strong></p>
              <button 
                onClick={() => {
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="bg-white text-primary-dark font-bold py-3 px-8 rounded hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </section>
        </main>

        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
};

export default App;