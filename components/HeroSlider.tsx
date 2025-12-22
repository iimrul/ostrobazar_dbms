import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: 'https://scornful-turquoise-unzn1c6sh1.edgeone.app/B1.jpg', // Placeholder
    title: 'Unleash Your Arsenal',
    subtitle: 'Premium Weapons for Elite Collectors & Tactical Minds',
    cta: 'Shop Now'
  },
  {
    image: 'https://static-olive-eo7zkke1wg.edgeone.app/B2.jpg',
    title: 'Gear Like the Pros',
    subtitle: 'Trusted by the elite. Built for performance.',
    cta: 'Explore'
  },
  {
    image: 'https://sticky-plum-0kx5qbnnlh.edgeone.app/Battlefield%20Game%20Desktop%20Pc%20And%20Mac%20Wallpaper.jpg',
    title: 'Your Mission Starts Here',
    subtitle: 'Equip like a warrior. Perform like a legend.',
    cta: 'View Collection'
  }
];

const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-black text-white group" id="home">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 tracking-wider animate-[fadeInUp_1s_ease-out]">{slide.title}</h2>
            <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl animate-[fadeInUp_1.2s_ease-out]">{slide.subtitle}</p>
            <a 
                href="#products" 
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded transition-transform transform hover:-translate-y-1 animate-[fadeInUp_1.4s_ease-out]"
            >
              {slide.cta}
            </a>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 hover:bg-primary text-white rounded-full flex items-center justify-center transition-colors md:opacity-0 md:group-hover:opacity-100"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 hover:bg-primary text-white rounded-full flex items-center justify-center transition-colors md:opacity-0 md:group-hover:opacity-100"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === current ? 'bg-primary w-8' : 'bg-gray-400'}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
