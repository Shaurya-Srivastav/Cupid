// theme.ts
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const colors = {
  brand: {
    50: '#ffe5e5',
    100: '#fbb8b8',
    200: '#f88a8a',
    300: '#f45c5c',
    400: '#f12e2e',
    500: '#ee0000',
    600: '#be0000',
    700: '#8f0000',
    800: '#5f0000',
    900: '#300000',
  },
};

const fonts = {
  heading: `'Poppins', sans-serif`,
  body: `'Inter', sans-serif`,
};

const styles = {
  global: {
    body: {
      bg: 'gray.50',
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      _focus: { boxShadow: 'none' },
      _hover: { bg: 'gray.100' },
    },
  },
};

const theme = extendTheme({ config, colors, fonts, styles, components });

export default theme;
