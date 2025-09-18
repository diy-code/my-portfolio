// Add these colors to your existing tailwind.config.js
module.exports = {
  // ...existing config
  theme: {
    extend: {
      // ...other extensions
      colors: {
        // ...other colors
        'twilight': {
          'light': '#1e2b45',
          'dark': '#141b30',
        }
      },
      backgroundImage: {
        'twilight-gradient': 'linear-gradient(to bottom right, #1e2b45, #141b30)',
      }
    }
  },
  // ...rest of config
}