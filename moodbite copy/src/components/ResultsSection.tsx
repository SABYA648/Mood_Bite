import React from 'react';
import { Result } from './types';

interface ResultsSectionProps {
  results: Result[];
  visibleItems: number;
  loadMore: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, visibleItems, loadMore }) => {
  return (
    <section className="p-8 mx-auto my-0 max-w-[1200px]">
      <div className="grid gap-8 grid-cols-[repeat(3,1fr)] max-md:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
        {results.slice(0, visibleItems).map((item) => (
          <div
            className="overflow-hidden rounded-2xl shadow-md transition-transform duration-[0.2s] ease-[ease]"
            key={item.id}
          >
            <img
              loading="lazy"
              className="object-cover overflow-hidden w-full aspect-square h-[200px]"
              src={`https://placehold.co/400x300`}
              alt={`${item.dishName} from ${item.restaurant}`}
            />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold">{item.dishName}</h3>
              <p className="mb-2 text-gray-500">{item.restaurant}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {item.eta} mins
                </span>
                <span className="font-semibold">{item.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center p-8">
        <button
          className="px-8 py-3 text-base font-medium rounded-xl transition-transform cursor-pointer border-[none] duration-[0.2s] ease-[ease] text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={loadMore}
        >
          Load More
        </button>
      </div>
    </section>
  );
};

export default ResultsSection;