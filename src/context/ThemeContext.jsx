import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem('inv_sitt_tema') || 'claro');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema === 'oscuro' ? 'oscuro' : 'claro');
    localStorage.setItem('inv_sitt_tema', tema);
  }, [tema]);

  function alternarTema() {
    setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'));
  }

  return (
    <ThemeContext.Provider value={{ tema, alternarTema, esOscuro: tema === 'oscuro' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
