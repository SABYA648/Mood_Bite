"use client";

import React, { useState } from 'react';
import Header from './Header';
import VoiceInput from './VoiceInput';
import FilterSection from './FilterSection';
import ResultsSection from './ResultsSection';
import Footer from './Footer';
import { Result, Filters } from './types';

const MoodBiteApp: React.FC = () => {
  const [transcription, setTranscription] = useState<string>("I'm craving something spicy but light");
  const [currentMood, setCurrentMood] = useState<string>("😋");
  const [isRefineInputOpen, setIsRefineInputOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    veg: false,
    egg: false,
    nonVeg: false,
  });
  const [selectedSort, setSelectedSort] = useState<string>("Mood");
  const [visibleItems, setVisibleItems] = useState<number>(6);

  const results: Result[] = [
    {
      id: 1,
      dishName: "Grilled Chili Lime Shrimp Bowl",
      restaurant: "Fresh Bites",
      eta: "25",
      price: "₹450",
    },
    {
      id: 2,
      dishName: "Spicy Thai Basil Stir-Fry",
      restaurant: "Asian Fusion",
      eta: "30",
      price: "₹380",
    },
    {
      id: 3,
      dishName: "Mexican Street Corn Salad",
      restaurant: "Taco House",
      eta: "20",
      price: "₹320",
    },
    {
      id: 4,
      dishName: "Quinoa Buddha Bowl",
      restaurant: "Green Kitchen",
      eta: "25",
      price: "₹420",
    },
    {
      id: 5,
      dishName: "Szechuan Tofu Stir-Fry",
      restaurant: "Wok & Roll",
      eta: "35",
      price: "₹350",
    },
    {
      id: 6,
      dishName: "Peri Peri Grilled Chicken",
      restaurant: "Flame Grill",
      eta: "30",
      price: "₹480",
    },
  ];

  const toggleRefineInput = () => setIsRefineInputOpen(!isRefineInputOpen);
  const toggleFilters = () => setIsFilterOpen(!isFilterOpen);
  const toggleFilter = (type: keyof Filters) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };
  const loadMore = () => setVisibleItems(prev => prev + 3);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <VoiceInput
          transcription={transcription}
          setTranscription={setTranscription}
          currentMood={currentMood}
          setCurrentMood={setCurrentMood}
          isRefineInputOpen={isRefineInputOpen}
          toggleRefineInput={toggleRefineInput}
        />
        <FilterSection
          isFilterOpen={isFilterOpen}
          toggleFilters={toggleFilters}
          filters={filters}
          toggleFilter={toggleFilter}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />
        <ResultsSection
          results={results}
          visibleItems={visibleItems}
          loadMore={loadMore}
        />
      </main>
      <Footer />
    </div>
  );
};

export default MoodBiteApp;