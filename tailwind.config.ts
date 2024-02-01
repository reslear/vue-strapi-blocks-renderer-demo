import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'electric-violet': {
          '50': '#ecf0ff',
          '100': '#dde4ff',
          '200': '#c2ccff',
          '300': '#9caaff',
          '400': '#757cff',
          '500': '#4945ff',
          '600': '#4936f5',
          '700': '#3e2ad8',
          '800': '#3325ae',
          '900': '#2d2689',
          '950': '#1c1650'
        }
      }
    }
  }
}
