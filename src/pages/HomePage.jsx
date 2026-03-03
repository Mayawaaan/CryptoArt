import React, { useContext, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import MarketSection from '../components/home/MarketSection';
import CorePlatformFeature from '../components/home/CorePlatformFeature';
import InfoSection from '../components/home/InfoSection';
import { ThemeContext } from '../context/ThemeContext';

const HomePage = () => {
  const { setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setTheme({
      background: '#111827', // gray-900
      primary: '#1f2937',   // gray-800
      text: '#ffffff',       // white
      accent: '#f59e0b',     // amber-500
    });
  }, [setTheme]);

  return (
    <>
      <HeroSection className="overflow-x-hidden" />
      <MarketSection className="overflow-y-hidden" />
      <CorePlatformFeature className="overflow-y-hidden" />
      <InfoSection className="overflow-y-hidden" />
    </>
  );
};

export default HomePage;