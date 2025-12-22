import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onSearch: (query: string) => void;
}

// --- CUSTOM ANIMATED LINK COMPONENT (RED EDITION) ---
const AnimatedLink = ({ href, text, onClick }: { href: string; text: string; onClick: (e: React.MouseEvent) => void }) => (
  <a 
    href={href} 
    onClick={onClick} 
    className="relative group py-2 px-1 block cursor-pointer"
  >
    {/* The Text - Turns RED on hover now */}
    <span className="font-orbitron font-bold tracking-widest text-gray-300 group-hover:text-red-500 transition-colors duration-300 uppercase text-sm">
      {text}
    </span>
    
    {/* The "Crimson Laser" Animation Line */}
    {/* Gradient is now deep red to bright red tip. Glow is intense red. */}
    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-red-900 to-red-500 group-hover:w-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(239,68,68,0.9)]"></span>
  </a>
);

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { cart, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = ['Home', 'Products', 'Deals'];

  return (
    <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-secondary/95 backdrop-blur-sm shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-orbitron font-bold tracking-wider uppercase">
          <a 
            href="#" 
            onClick={(e) => scrollToSection(e, 'home')} 
            className="group flex items-center cursor-pointer"
          >
            <span className="text-white group-hover:text-primary transition-colors duration-300">Ostro</span> 
            <span className="mx-2 text-black font-light opacity-50">|</span> 
            <span className="text-primary group-hover:text-white transition-colors duration-300">Bazar</span>
          </a>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navLinks.map((item) => (
              <li key={item}>
                <AnimatedLink 
                    href={`#${item.toLowerCase()}`}
                    text={item}
                    onClick={(e) => scrollToSection(e, item.toLowerCase())}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-gray-900 border border-gray-700 text-white rounded-l px-3 py-1 focus:outline-none focus:border-primary w-40 text-sm font-sans"
              onChange={(e) => onSearch(e.target.value)}
            />
            <button className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-r transition-colors">
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* Cart Icon */}
          <div 
            className={`relative cursor-pointer text-white hover:text-primary transition-transform ${bump ? 'animate-bump' : ''}`}
            onClick={() => setIsOpen(true)}
          >
            <i className="fas fa-shopping-cart text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-secondary">
                {cartCount}
              </span>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden text-white text-xl cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-secondary border-t border-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="flex flex-col p-4 space-y-4">
           {navLinks.map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className="block text-white hover:text-primary font-medium uppercase tracking-wide font-orbitron"
                  onClick={(e) => scrollToSection(e, item.toLowerCase())}
                >
                  {item}
                </a>
              </li>
            ))}
            <li className="pt-2">
               <div className="flex w-full">
                <input 
                  type="text" 
                  placeholder="Search Products..." 
                  className="bg-gray-900 border border-gray-700 text-white rounded-l px-3 py-2 focus:outline-none focus:border-primary w-full"
                  onChange={(e) => onSearch(e.target.value)}
                />
                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;