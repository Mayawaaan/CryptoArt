import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Using lucide-react for icons
import navlinks from '../data/navlinks';
import { ThemeContext } from '../context/ThemeContext.jsx';
import Logo from '../assets/NavbarLogo.png';

const Navbar = () => {
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav style={{ backgroundColor: theme.primary }} className="p-4 transition-all duration-300 relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/">
          <img className="h-10 w-auto cursor-pointer" src={Logo} alt="CryptoArt" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navlinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              style={{ color: theme.text }}
              className="px-6 py-2 rounded-md text-sm font-medium hover:bg-amber-400 transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Button (Desktop) */}
        <div className="hidden md:block">
          <button
            style={{ backgroundColor: theme.accent, color: theme.text }}
            className="cursor-pointer px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-300"
          >
            Connect Wallet
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu} 
            style={{ color: theme.text }}
            className="focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 w-full shadow-lg transition-all duration-300`} 
           style={{ backgroundColor: theme.primary }}>
        <div className="flex flex-col p-4 space-y-4">
          {navlinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              style={{ color: theme.text }}
              className="text-lg font-medium border-b border-gray-700 pb-2"
            >
              {link.name}
            </Link>
          ))}
          <button
            style={{ backgroundColor: theme.accent, color: theme.text }}
            className="w-full px-4 py-3 rounded-md text-center font-medium"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;