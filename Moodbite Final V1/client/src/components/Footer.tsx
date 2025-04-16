import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 text-center">
        <button className="text-secondary text-sm hover:underline">
          Send Feedback
        </button>
      </div>
    </footer>
  );
};

export default Footer;
