import React, { useEffect, useState } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { useNavigate, useHref } from 'react-router-dom';

interface HeroProviderProps {
  children: React.ReactNode;
}

const CustomHeroUIProvider: React.FC<HeroProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Set theme on component mount
  useEffect(() => {
    setMounted(true);
    // Check for user preference or system preference
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  // Return early if not mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      {children}
    </HeroUIProvider>
  );
};

export default CustomHeroUIProvider;