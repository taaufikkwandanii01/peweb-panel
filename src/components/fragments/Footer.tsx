import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Copyright */}
        <div className="pt-6 text-center">
          <p className="text-sm">© {currentYear} Panel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
