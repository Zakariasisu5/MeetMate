import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  // false = blue, true = dark
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('blue');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('blue');
      }
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('blue');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const themeString = newTheme ? 'dark' : 'blue';
    localStorage.setItem('theme', themeString);
    if (themeString === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('blue');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('blue');
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-8 ${isDark ? 'bg-white/10' : 'bg-blue-500/20'} backdrop-blur-sm rounded-full border border-white/20 p-1 cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-6 h-6 ${isDark ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-400 to-cyan-400'} rounded-full flex items-center justify-center`}
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-white" />
          ) : (
            <Sun className="w-4 h-4 text-blue-600" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;

