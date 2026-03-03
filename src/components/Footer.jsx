import React from "react";
import { Link } from "react-router-dom";
import { Mail, CircleArrowRight } from "lucide-react";
import Logo from "../assets/NavbarLogo.png";

import {
  socialLinks,
  platformLinks,
  supportLinks,
  legalLinks,
  footerContent,
} from "../data/FooterData";
import Newsletter from "./Newsletter";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="CryptoArt" className="h-8 w-auto" />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              {footerContent.brandDescription}
            </p>

            <div className="flex gap-4">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-black transition-all duration-300"
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Platform
            </h3>
            <ul className="space-y-4">
              {platformLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Support
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <Newsletter />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CryptoArt. All rights reserved.
            <br />
            <hr />
            Designed and developed by {footerContent.designerName}
          </p>

          <a
            href={footerContent.creditLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors"
          >
            <p className="uppercase text-gray-800 text-xs cursor-pointer">
              {footerContent.creditName}
            </p>
          </a>

          <div className="flex gap-8 text-sm text-gray-500">
            {legalLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="hover:text-amber-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;