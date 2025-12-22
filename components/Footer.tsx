import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 border-t border-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-orbitron font-bold relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent">
              Ostro Bazar
            </h3>
            <p className="text-gray-400 text-sm">
              Your one-stop website for all kinds of premium tactical weapons and defense systems.
            </p>
            <div className="flex space-x-3 pt-2">
              {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((icon) => (
                <a key={icon} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors hover:-translate-y-1">
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-orbitron font-bold relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {['Home', 'Products', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-xl font-orbitron font-bold relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent">
              Customer Service
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {['FAQ', 'Shipping & Returns', 'Terms & Conditions', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-orbitron font-bold relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent">
              Contact Us
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <i className="fas fa-map-marker-alt text-accent mt-1"></i>
                <span>123 OstroBazar, Gulistan</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-phone text-accent mt-1"></i>
                <span>+8801XXXXXXXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-envelope text-accent mt-1"></i>
                <span>info@OstroBazar.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Ostro Bazar. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
