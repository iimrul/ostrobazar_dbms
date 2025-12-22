import React from 'react';

const categories = [
  { name: 'Guns', icon: 'fa-gun' },
  { name: 'Missiles', icon: 'fa-rocket' },
  { name: 'Rockets', icon: 'fa-space-shuttle' }, // Using available free FA icon
  { name: 'Drones/UAVs', icon: 'fa-plane' }
];

interface CategorySectionProps {
    onSelectCategory: (cat: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white relative inline-block pb-2">
                Shop by Category
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary"></span>
            </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.name);
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white hover:bg-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 rounded-lg shadow-lg p-6 w-40 text-center group"
            >
              <div className="text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <h3 className="text-gray-900 font-semibold">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
