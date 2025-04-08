import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-6 mx-auto my-0 w-4/5 max-sm:flex max-sm:flex-row max-sm:justify-around max-sm:self-stretch max-sm:w-auto">
      <h1 className="flex flex-col text-2xl font-bold text-zinc-900">
        <span className="text-6xl text-purple-600 max-sm:text-4xl" style={{ color: 'rgb(189, 16, 224)' }}>
          MoodBite
        </span>
      </h1>
      <button className="flex px-4 py-2 text-base text-gray-600 rounded-xl border border-red-700 border-solid max-md:flex max-sm:hidden max-sm:flex-row max-sm:leading-4 max-sm:text-center">
        <span style={{ color: 'rgb(208, 2, 27)' }} className="text-2xl">
          About Me
        </span>
      </button>
    </header>
  );
};

export default Header;