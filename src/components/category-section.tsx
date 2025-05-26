"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
};

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Төрөл ангиллууд</h2>
          <Link 
            href="/categories"
            className="text-orange-500 hover:text-orange-600 flex items-center font-semibold"
          >
            Бүх ангилал <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="relative">
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
            onClick={() => {
              const container = document.getElementById('categories-container');
              if (container) {
                container.scrollBy({ left: -300, behavior:'smooth'});
              }
            }}
            aria-label="Scroll left"
          >
            <ChevronRight className="h-5 w-5 transform rotate-180 text-gray-600" />
          </button>
          
          <div id="categories-container" className="flex overflow-x-auto space-x-3 w-full scrollbar-hide scroll-smooth px-4">
            {categories.map((category, i) => (
              <Link
                key={i}
                href={`/category/${category.id}`}
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex cursor-pointer transform hover:scale-105 transition duration-300 w-72 justify-between items-center">
                  <div className="flex font-medium text-center items-center text-4xl w-12">
                    {category.icon}
                  </div>
                  <div className="font-medium text-center">{category.name}</div>
                  <div className="flex text-sm text-gray-500">
                    {category.count}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
            onClick={() => {
              const container = document.getElementById('categories-container');
              if (container) {
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}