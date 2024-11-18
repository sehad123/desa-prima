// components/Header.js
import React from "react";
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon (FontAwesome)

const Header = ({ onLogout }) => {
  return (
    <div className="flex justify-between items-center mb-5">
      {/* Website name on the left */}
      <div className="text-xl font-semibold text-gray-700">Desa Prima Yogyakarta</div>

      {/* Logout icon on the right */}
      <button className="text-gray-600 hover:text-red-600" onClick={onLogout}>
        <FaSignOutAlt size={24} />
      </button>
    </div>
  );
};

export default Header;
