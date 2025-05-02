import React, { createContext, useState, useMemo, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

export const ThemeContext = createContext({
  mode: 'light' as ThemeMode,
  toggleMode: () => {}
});

export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  
  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };
  
  const contextValue = useMemo(() => ({
    mode,
    toggleMode
  }), [mode]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};