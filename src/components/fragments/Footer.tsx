import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo / Brand Section */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-linear-to-tr from-indigo-600 to-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-[10px] font-black italic">
                P
              </span>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="flex items-center md:items-end">
            <p className="text-xs text-gray-500 font-medium">
              © {currentYear} PeWeb Panel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
