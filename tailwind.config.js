module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink:     'hsl(var(--pink))',
        gold:     'hsl(var(--gold))',
        cyan:     'hsl(var(--cyan))',
        navy:     'hsl(var(--navy))',
        'navy-2': 'hsl(var(--navy-2))',
        orange:   'hsl(var(--orange))',
        purple:   'hsl(var(--purple))',
        cream:    'hsl(var(--cream))',
      },
    },
  },
  plugins: [],
}
