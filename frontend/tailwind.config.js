/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  function ({ addUtilities }) {
    addUtilities({
      '.text-gradient': {
        'background-image': 'linear-gradient(90deg, #FD3A47 0%, #6A367C 100%)',
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
      '.text-gradient1': {
        'background-image': 'linear-gradient(90deg, #FF3B8D 15.13%, #1B3399 83.03%)',
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
      '.text-gradient2': {
        'background-image': 'linear-gradient(92.81deg, #E63A8E 3.32%, #353497 70.66%)',
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
      '.text-gradient3': {
        'background-image': 'linear-gradient(90.8deg, #FF3C8E 20.12%, #1B3399 79.88%)',
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
      '.text-gradient4': {
        'background-image': 'linear-gradient(90.57deg, #F23E7F 0.1%, #5447EC 99.9%)',
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
    });
  },
}

